import { BigQuery } from '@google-cloud/bigquery';
import type { Lead, LeadCaptureConfig } from '../types/index.js';

const bigquery = new BigQuery({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export class BigQueryService {
  static async captureLeads(config: LeadCaptureConfig): Promise<Lead[]> {
    const query = `
      DECLARE start_date DATE DEFAULT DATE_SUB(CURRENT_DATE('America/Sao_Paulo'), INTERVAL ${config.janela_de_dias} DAY);
      DECLARE end_date   DATE DEFAULT CURRENT_DATE('America/Sao_Paulo');

      WITH src AS (
        SELECT
          CONCAT(e.cnpj_basico, e.cnpj_ordem, e.cnpj_dv) AS cnpj,
          SAFE.PARSE_DATE('%Y-%m-%d', CAST(e.data_inicio_atividade AS STRING)) AS data_inicio_atividade,
          CAST(e.cnae_fiscal_principal AS STRING) AS cnae_fiscal_principal,
          e.sigla_uf AS uf,
          m.nome AS municipio,
          em.razao_social,
          em.porte AS porte_da_empresa,
          e.cep, e.ddd_1, e.telefone_1, e.ddd_2, e.telefone_2, e.email,
          CASE WHEN LENGTH(e.cep) = 8 THEN CONCAT(SUBSTR(e.cep,1,5), '-', SUBSTR(e.cep,6,3)) ELSE e.cep END AS cep_formatado,
          CASE WHEN e.ddd_1 IS NOT NULL AND e.telefone_1 IS NOT NULL THEN CONCAT('(', e.ddd_1, ') ', e.telefone_1) END AS telefone1_formatado,
          CASE WHEN e.ddd_2 IS NOT NULL AND e.telefone_2 IS NOT NULL THEN CONCAT('(', e.ddd_2, ') ', e.telefone_2) END AS telefone2_formatado,
          ARRAY_TO_STRING(
            ARRAY(
              SELECT tel FROM UNNEST([
                CASE WHEN e.ddd_1 IS NOT NULL AND e.telefone_1 IS NOT NULL THEN CONCAT('(', e.ddd_1, ') ', e.telefone_1) ELSE NULL END,
                CASE WHEN e.ddd_2 IS NOT NULL AND e.telefone_2 IS NOT NULL THEN CONCAT('(', e.ddd_2, ') ', e.telefone_2) ELSE NULL END
              ]) tel
              WHERE tel IS NOT NULL
            ), ' / '
          ) AS telefones
        FROM \`basedosdados.br_me_cnpj.estabelecimentos\` e
        JOIN \`basedosdados.br_me_cnpj.empresas\` em USING (cnpj_basico)
        LEFT JOIN \`basedosdados.br_bd_diretorios_brasil.municipio\` m ON e.id_municipio = m.id_municipio
      )
      SELECT
        cnpj,
        FORMAT_DATE('%Y-%m-%d', data_inicio_atividade) AS data_inicio_atividade,
        cnae_fiscal_principal, uf, municipio, razao_social, porte_da_empresa,
        cep, ddd_1, telefone_1, ddd_2, telefone_2, email,
        cep_formatado, telefone1_formatado, telefone2_formatado, telefones
      FROM src
      WHERE data_inicio_atividade BETWEEN start_date AND end_date
        AND cnae_fiscal_principal = '${config.cnae}'
        ${config.uf_filtro ? `AND uf = '${config.uf_filtro}'` : ''}
      ORDER BY data_inicio_atividade DESC
      LIMIT ${config.limite_registros};
    `;

    const [job] = await bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();
    
    return rows as Lead[];
  }

  static async getLeadStats(cnae: string, days: number = 30) {
    const query = `
      SELECT
        COUNT(*) as total_leads,
        COUNT(DISTINCT uf) as states_count,
        COUNT(DISTINCT municipio) as cities_count
      FROM \`basedosdados.br_me_cnpj.estabelecimentos\` e
      WHERE CAST(e.cnae_fiscal_principal AS STRING) = '${cnae}'
        AND SAFE.PARSE_DATE('%Y-%m-%d', CAST(e.data_inicio_atividade AS STRING)) 
            >= DATE_SUB(CURRENT_DATE(), INTERVAL ${days} DAY)
    `;

    const [job] = await bigquery.createQueryJob({ query });
    const [rows] = await job.getQueryResults();
    
    return rows[0];
  }
}
