/**
 * Lead Qualification Service
 * Implementa filtros e scoring de qualificação de leads
 */

interface Lead {
  cnpj: string;
  razao_social: string;
  porte_da_empresa?: string;
  email?: string;
  telefone_1?: string;
  telefone_2?: string;
  cnae_fiscal_principal: string;
  uf: string;
  municipio?: string;
  data_inicio_atividade: string;
}

interface QualificationScore {
  score: number;
  qualified: boolean;
  reasons: string[];
  tier: 'A' | 'B' | 'C' | 'D';
}

interface QualificationCriteria {
  minScore: number;
  requireEmail: boolean;
  requirePhone: boolean;
  allowedPortes: string[];
  excludedUFs?: string[];
  minDaysActive?: number;
}

export class LeadQualificationService {
  private criteria: QualificationCriteria;

  constructor(criteria?: Partial<QualificationCriteria>) {
    this.criteria = {
      minScore: criteria?.minScore || 50,
      requireEmail: criteria?.requireEmail ?? false,
      requirePhone: criteria?.requirePhone ?? true,
      allowedPortes: criteria?.allowedPortes || ['PEQUENA', 'MEDIA', 'GRANDE'],
      excludedUFs: criteria?.excludedUFs || [],
      minDaysActive: criteria?.minDaysActive || 0
    };
  }

  /**
   * Qualifica um lead e retorna score
   */
  qualifyLead(lead: Lead): QualificationScore {
    let score = 0;
    const reasons: string[] = [];

    // 1. Porte da empresa (30 pontos)
    const porteScore = this.scorePorte(lead.porte_da_empresa);
    score += porteScore.score;
    if (porteScore.reason) reasons.push(porteScore.reason);

    // 2. Contato disponível (40 pontos)
    const contactScore = this.scoreContact(lead);
    score += contactScore.score;
    reasons.push(...contactScore.reasons);

    // 3. Dados completos (20 pontos)
    const completenessScore = this.scoreCompleteness(lead);
    score += completenessScore.score;
    if (completenessScore.reason) reasons.push(completenessScore.reason);

    // 4. Localização (10 pontos)
    const locationScore = this.scoreLocation(lead.uf, lead.municipio);
    score += locationScore.score;
    if (locationScore.reason) reasons.push(locationScore.reason);

    // Determinar tier
    const tier = this.determineTier(score);

    // Verificar se está qualificado
    const qualified = this.isQualified(lead, score);

    return {
      score,
      qualified,
      reasons,
      tier
    };
  }

  /**
   * Filtra lista de leads qualificados
   */
  filterQualifiedLeads(leads: Lead[]): Lead[] {
    return leads.filter(lead => {
      const qualification = this.qualifyLead(lead);
      return qualification.qualified;
    });
  }

  /**
   * Ordena leads por score
   */
  sortByScore(leads: Lead[]): Array<Lead & { qualification: QualificationScore }> {
    return leads
      .map(lead => ({
        ...lead,
        qualification: this.qualifyLead(lead)
      }))
      .sort((a, b) => b.qualification.score - a.qualification.score);
  }

  /**
   * Score baseado no porte da empresa
   */
  private scorePorte(porte?: string): { score: number; reason?: string } {
    if (!porte) return { score: 0 };

    const porteUpper = porte.toUpperCase();
    
    if (porteUpper.includes('GRANDE')) {
      return { score: 30, reason: 'Empresa de grande porte' };
    }
    if (porteUpper.includes('MEDIA') || porteUpper.includes('MÉDIA')) {
      return { score: 25, reason: 'Empresa de médio porte' };
    }
    if (porteUpper.includes('PEQUENA')) {
      return { score: 20, reason: 'Empresa de pequeno porte' };
    }
    if (porteUpper.includes('MEI') || porteUpper.includes('MICRO')) {
      return { score: 10, reason: 'Microempresa' };
    }

    return { score: 5 };
  }

  /**
   * Score baseado em informações de contato
   */
  private scoreContact(lead: Lead): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // Email válido (20 pontos)
    if (this.isValidEmail(lead.email)) {
      score += 20;
      reasons.push('Email válido disponível');
    }

    // Telefone 1 válido (15 pontos)
    if (this.isValidPhone(lead.telefone_1)) {
      score += 15;
      reasons.push('Telefone principal válido');
    }

    // Telefone 2 válido (5 pontos)
    if (this.isValidPhone(lead.telefone_2)) {
      score += 5;
      reasons.push('Telefone secundário disponível');
    }

    return { score, reasons };
  }

  /**
   * Score baseado na completude dos dados
   */
  private scoreCompleteness(lead: Lead): { score: number; reason?: string } {
    let score = 0;
    let fieldsPresent = 0;
    const totalFields = 7;

    if (lead.razao_social) fieldsPresent++;
    if (lead.porte_da_empresa) fieldsPresent++;
    if (lead.email) fieldsPresent++;
    if (lead.telefone_1) fieldsPresent++;
    if (lead.municipio) fieldsPresent++;
    if (lead.cnae_fiscal_principal) fieldsPresent++;
    if (lead.data_inicio_atividade) fieldsPresent++;

    score = Math.floor((fieldsPresent / totalFields) * 20);

    return {
      score,
      reason: score >= 15 ? 'Dados completos' : undefined
    };
  }

  /**
   * Score baseado na localização
   */
  private scoreLocation(uf: string, municipio?: string): { score: number; reason?: string } {
    // Capitais e grandes centros (10 pontos)
    const majorCities = [
      'SÃO PAULO', 'RIO DE JANEIRO', 'BRASÍLIA', 'BELO HORIZONTE',
      'CURITIBA', 'PORTO ALEGRE', 'SALVADOR', 'FORTALEZA', 'RECIFE'
    ];

    if (municipio && majorCities.some(city => municipio.toUpperCase().includes(city))) {
      return { score: 10, reason: 'Localizado em grande centro urbano' };
    }

    // Estados prioritários (5 pontos)
    const priorityStates = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC'];
    if (priorityStates.includes(uf)) {
      return { score: 5, reason: 'Estado prioritário' };
    }

    return { score: 3 };
  }

  /**
   * Determina tier do lead
   */
  private determineTier(score: number): 'A' | 'B' | 'C' | 'D' {
    if (score >= 80) return 'A';
    if (score >= 60) return 'B';
    if (score >= 40) return 'C';
    return 'D';
  }

  /**
   * Verifica se lead está qualificado
   */
  private isQualified(lead: Lead, score: number): boolean {
    // Score mínimo
    if (score < this.criteria.minScore) return false;

    // Email obrigatório
    if (this.criteria.requireEmail && !this.isValidEmail(lead.email)) {
      return false;
    }

    // Telefone obrigatório
    if (this.criteria.requirePhone && !this.isValidPhone(lead.telefone_1)) {
      return false;
    }

    // Porte permitido
    if (lead.porte_da_empresa) {
      const porteUpper = lead.porte_da_empresa.toUpperCase();
      const isAllowed = this.criteria.allowedPortes.some(p => 
        porteUpper.includes(p.toUpperCase())
      );
      if (!isAllowed) return false;
    }

    // UF excluída
    if (this.criteria.excludedUFs && this.criteria.excludedUFs.includes(lead.uf)) {
      return false;
    }

    // Dias mínimos de atividade
    if (this.criteria.minDaysActive && this.criteria.minDaysActive > 0) {
      const daysActive = this.calculateDaysActive(lead.data_inicio_atividade);
      if (daysActive < this.criteria.minDaysActive) return false;
    }

    return true;
  }

  /**
   * Valida email
   */
  private isValidEmail(email?: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida telefone
   */
  private isValidPhone(phone?: string): boolean {
    if (!phone) return false;
    // Remove caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    // Telefone brasileiro: 10 ou 11 dígitos
    return cleaned.length >= 10 && cleaned.length <= 11;
  }

  /**
   * Calcula dias desde abertura
   */
  private calculateDaysActive(dataInicio: string): number {
    try {
      const startDate = new Date(dataInicio);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - startDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  }

  /**
   * Atualiza critérios de qualificação
   */
  updateCriteria(newCriteria: Partial<QualificationCriteria>): void {
    this.criteria = { ...this.criteria, ...newCriteria };
  }

  /**
   * Obtém critérios atuais
   */
  getCriteria(): QualificationCriteria {
    return { ...this.criteria };
  }
}

// Instância global com critérios padrão
export const leadQualifier = new LeadQualificationService({
  minScore: 50,
  requireEmail: false,
  requirePhone: true,
  allowedPortes: ['PEQUENA', 'MEDIA', 'GRANDE'],
  minDaysActive: 0
});

// Instância para leads premium (critérios mais rigorosos)
export const premiumLeadQualifier = new LeadQualificationService({
  minScore: 70,
  requireEmail: true,
  requirePhone: true,
  allowedPortes: ['MEDIA', 'GRANDE'],
  minDaysActive: 30
});
