/**
 * Schedule Configuration Service
 * Gerencia horários de funcionamento e disponibilidade de forma dinâmica
 */

import { Pool } from 'pg';

interface BusinessHours {
  id?: number;
  day_of_week: number; // 0 = Domingo, 6 = Sábado
  start_time: string;  // HH:MM formato
  end_time: string;    // HH:MM formato
  is_active: boolean;
  timezone: string;
}

interface Holiday {
  id?: number;
  date: string;        // YYYY-MM-DD
  name: string;
  is_working_day: boolean;
}

interface ScheduleConfig {
  business_hours: BusinessHours[];
  holidays: Holiday[];
  default_timezone: string;
  allow_weekend: boolean;
  buffer_minutes_before: number;
  buffer_minutes_after: number;
}

export class ScheduleConfigService {
  private pool: Pool;
  private cache: ScheduleConfig | null = null;
  private cacheExpiry: number = 0;
  private cacheTTL: number = 5 * 60 * 1000; // 5 minutos

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Inicializa tabelas de configuração
   */
  async initializeTables(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS business_hours (
        id SERIAL PRIMARY KEY,
        day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        is_active BOOLEAN DEFAULT true,
        timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(day_of_week)
      );
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS holidays (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        is_working_day BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS schedule_config (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) NOT NULL UNIQUE,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Inserir horários padrão se não existirem
    await this.insertDefaultSchedule();
  }

  /**
   * Insere horários padrão
   */
  private async insertDefaultSchedule(): Promise<void> {
    const defaultHours = [
      { day: 1, start: '09:00', end: '18:00' }, // Segunda
      { day: 2, start: '09:00', end: '18:00' }, // Terça
      { day: 3, start: '09:00', end: '18:00' }, // Quarta
      { day: 4, start: '09:00', end: '18:00' }, // Quinta
      { day: 5, start: '09:00', end: '18:00' }, // Sexta
      { day: 6, start: '09:00', end: '13:00' }, // Sábado (meio período)
    ];

    for (const hour of defaultHours) {
      await this.pool.query(`
        INSERT INTO business_hours (day_of_week, start_time, end_time, is_active)
        VALUES ($1, $2, $3, true)
        ON CONFLICT (day_of_week) DO NOTHING
      `, [hour.day, hour.start, hour.end]);
    }

    // Feriados nacionais 2024/2025
    const holidays = [
      { date: '2024-01-01', name: 'Ano Novo' },
      { date: '2024-02-13', name: 'Carnaval' },
      { date: '2024-03-29', name: 'Sexta-feira Santa' },
      { date: '2024-04-21', name: 'Tiradentes' },
      { date: '2024-05-01', name: 'Dia do Trabalho' },
      { date: '2024-09-07', name: 'Independência' },
      { date: '2024-10-12', name: 'Nossa Senhora Aparecida' },
      { date: '2024-11-02', name: 'Finados' },
      { date: '2024-11-15', name: 'Proclamação da República' },
      { date: '2024-12-25', name: 'Natal' },
      { date: '2025-01-01', name: 'Ano Novo' },
    ];

    for (const holiday of holidays) {
      await this.pool.query(`
        INSERT INTO holidays (date, name, is_working_day)
        VALUES ($1, $2, false)
        ON CONFLICT (date) DO NOTHING
      `, [holiday.date, holiday.name]);
    }
  }

  /**
   * Obtém configuração completa
   */
  async getScheduleConfig(): Promise<ScheduleConfig> {
    // Verificar cache
    if (this.cache && Date.now() < this.cacheExpiry) {
      return this.cache;
    }

    const hoursResult = await this.pool.query(`
      SELECT * FROM business_hours WHERE is_active = true ORDER BY day_of_week
    `);

    const holidaysResult = await this.pool.query(`
      SELECT * FROM holidays WHERE date >= CURRENT_DATE ORDER BY date
    `);

    const config: ScheduleConfig = {
      business_hours: hoursResult.rows,
      holidays: holidaysResult.rows,
      default_timezone: 'America/Sao_Paulo',
      allow_weekend: hoursResult.rows.some(h => h.day_of_week === 0 || h.day_of_week === 6),
      buffer_minutes_before: 15,
      buffer_minutes_after: 15
    };

    // Atualizar cache
    this.cache = config;
    this.cacheExpiry = Date.now() + this.cacheTTL;

    return config;
  }

  /**
   * Verifica se está em horário de funcionamento
   */
  async isBusinessHours(date?: Date): Promise<boolean> {
    const checkDate = date || new Date();
    const config = await this.getScheduleConfig();

    // Verificar se é feriado
    const dateStr = checkDate.toISOString().split('T')[0];
    const holiday = config.holidays.find(h => h.date === dateStr);
    if (holiday && !holiday.is_working_day) {
      return false;
    }

    // Verificar dia da semana
    const dayOfWeek = checkDate.getDay();
    const businessHour = config.business_hours.find(h => h.day_of_week === dayOfWeek);
    
    if (!businessHour) {
      return false;
    }

    // Verificar horário
    const currentTime = checkDate.toTimeString().slice(0, 5); // HH:MM
    return currentTime >= businessHour.start_time && currentTime <= businessHour.end_time;
  }

  /**
   * Obtém próximo horário disponível
   */
  async getNextAvailableSlot(fromDate?: Date): Promise<Date> {
    const config = await this.getScheduleConfig();
    let checkDate = fromDate ? new Date(fromDate) : new Date();
    
    // Adicionar buffer
    checkDate.setMinutes(checkDate.getMinutes() + config.buffer_minutes_before);

    // Procurar próximo slot disponível (máximo 30 dias)
    for (let i = 0; i < 30; i++) {
      const dayOfWeek = checkDate.getDay();
      const dateStr = checkDate.toISOString().split('T')[0];
      
      // Verificar se não é feriado
      const holiday = config.holidays.find(h => h.date === dateStr);
      if (holiday && !holiday.is_working_day) {
        checkDate.setDate(checkDate.getDate() + 1);
        checkDate.setHours(9, 0, 0, 0);
        continue;
      }

      // Verificar se tem horário configurado
      const businessHour = config.business_hours.find(h => h.day_of_week === dayOfWeek);
      if (!businessHour) {
        checkDate.setDate(checkDate.getDate() + 1);
        checkDate.setHours(9, 0, 0, 0);
        continue;
      }

      // Verificar se está dentro do horário
      const currentTime = checkDate.toTimeString().slice(0, 5);
      if (currentTime < businessHour.start_time) {
        // Ajustar para início do expediente
        const [hours, minutes] = businessHour.start_time.split(':');
        checkDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return checkDate;
      } else if (currentTime <= businessHour.end_time) {
        // Está dentro do horário
        return checkDate;
      } else {
        // Passou do horário, tentar próximo dia
        checkDate.setDate(checkDate.getDate() + 1);
        checkDate.setHours(9, 0, 0, 0);
      }
    }

    // Se não encontrou, retornar próxima segunda 9h
    checkDate = new Date();
    checkDate.setDate(checkDate.getDate() + ((1 + 7 - checkDate.getDay()) % 7));
    checkDate.setHours(9, 0, 0, 0);
    return checkDate;
  }

  /**
   * Atualiza horário de funcionamento
   */
  async updateBusinessHours(dayOfWeek: number, startTime: string, endTime: string): Promise<void> {
    await this.pool.query(`
      INSERT INTO business_hours (day_of_week, start_time, end_time, is_active)
      VALUES ($1, $2, $3, true)
      ON CONFLICT (day_of_week) 
      DO UPDATE SET start_time = $2, end_time = $3, updated_at = CURRENT_TIMESTAMP
    `, [dayOfWeek, startTime, endTime]);

    this.clearCache();
  }

  /**
   * Adiciona feriado
   */
  async addHoliday(date: string, name: string, isWorkingDay: boolean = false): Promise<void> {
    await this.pool.query(`
      INSERT INTO holidays (date, name, is_working_day)
      VALUES ($1, $2, $3)
      ON CONFLICT (date) DO UPDATE SET name = $2, is_working_day = $3
    `, [date, name, isWorkingDay]);

    this.clearCache();
  }

  /**
   * Remove feriado
   */
  async removeHoliday(date: string): Promise<void> {
    await this.pool.query('DELETE FROM holidays WHERE date = $1', [date]);
    this.clearCache();
  }

  /**
   * Gera texto de disponibilidade para prompt
   */
  async generateAvailabilityText(): Promise<string> {
    const config = await this.getScheduleConfig();
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    let text = 'Horários de funcionamento:\n';
    
    for (const hour of config.business_hours) {
      text += `${dayNames[hour.day_of_week]}: ${hour.start_time} às ${hour.end_time}\n`;
    }

    if (config.holidays.length > 0) {
      text += '\nPróximos feriados:\n';
      config.holidays.slice(0, 5).forEach(h => {
        text += `${h.date}: ${h.name}\n`;
      });
    }

    return text;
  }

  /**
   * Limpa cache
   */
  private clearCache(): void {
    this.cache = null;
    this.cacheExpiry = 0;
  }
}

// Exportar instância (será inicializada com pool do banco)
export let scheduleConfig: ScheduleConfigService;

export function initializeScheduleConfig(pool: Pool): void {
  scheduleConfig = new ScheduleConfigService(pool);
}
