import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import type { Lead } from '../types/index.js';

export class SheetsService {
  private static doc: GoogleSpreadsheet | null = null;

  private static async getDoc() {
    if (this.doc) return this.doc;

    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEETS_ID!,
      serviceAccountAuth
    );

    await this.doc.loadInfo();
    return this.doc;
  }

  static async appendLeads(leads: Lead[]): Promise<void> {
    const doc = await this.getDoc();
    const sheet = doc.sheetsByIndex[0];

    const rows = leads.map(lead => ({
      cnpj: lead.cnpj,
      data_inicio_atividade: lead.data_inicio_atividade,
      cnae_fiscal_principal: lead.cnae_fiscal_principal,
      uf: lead.uf,
      municipio: lead.municipio,
      razao_social: lead.razao_social,
      porte_da_empresa: lead.porte_da_empresa,
      cep: lead.cep || '',
      ddd_1: lead.ddd_1 || '',
      telefone_1: lead.telefone_1 || '',
      ddd_2: lead.ddd_2 || '',
      telefone_2: lead.telefone_2 || '',
      email: lead.email || '',
      cep_formatado: lead.cep_formatado || '',
      telefone1_formatado: lead.telefone1_formatado || '',
      telefone2_formatado: lead.telefone2_formatado || '',
      telefones: lead.telefones || '',
      data_captura: new Date().toISOString(),
    }));

    await sheet.addRows(rows);
  }

  static async getLeadByCNPJ(cnpj: string): Promise<Lead | null> {
    const doc = await this.getDoc();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const row = rows.find(r => r.get('cnpj') === cnpj);
    if (!row) return null;

    return {
      cnpj: row.get('cnpj'),
      data_inicio_atividade: row.get('data_inicio_atividade'),
      cnae_fiscal_principal: row.get('cnae_fiscal_principal'),
      uf: row.get('uf'),
      municipio: row.get('municipio'),
      razao_social: row.get('razao_social'),
      porte_da_empresa: row.get('porte_da_empresa'),
      cep: row.get('cep'),
      ddd_1: row.get('ddd_1'),
      telefone_1: row.get('telefone_1'),
      ddd_2: row.get('ddd_2'),
      telefone_2: row.get('telefone_2'),
      email: row.get('email'),
      cep_formatado: row.get('cep_formatado'),
      telefone1_formatado: row.get('telefone1_formatado'),
      telefone2_formatado: row.get('telefone2_formatado'),
      telefones: row.get('telefones'),
    };
  }
}
