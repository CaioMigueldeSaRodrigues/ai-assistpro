/**
 * Rate Limiting Service
 * Implementa controle de taxa com exponential backoff para APIs externas
 */

interface RateLimitConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

interface RateLimitState {
  requestCount: number;
  windowStart: number;
  failures: number;
}

export class RateLimiter {
  private states: Map<string, RateLimitState> = new Map();
  private config: RateLimitConfig;

  constructor(config?: Partial<RateLimitConfig>) {
    this.config = {
      maxRetries: config?.maxRetries || 5,
      initialDelay: config?.initialDelay || 3000,
      maxDelay: config?.maxDelay || 30000,
      backoffMultiplier: config?.backoffMultiplier || 2
    };
  }

  /**
   * Executa uma função com retry e exponential backoff
   */
  async executeWithBackoff<T>(
    fn: () => Promise<T>,
    context: string = 'default'
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const result = await fn();
        this.resetFailures(context);
        return result;
      } catch (error) {
        lastError = error as Error;
        this.incrementFailures(context);
        
        if (attempt < this.config.maxRetries) {
          const delay = this.calculateDelay(attempt);
          console.log(`[RateLimit] Retry ${attempt + 1}/${this.config.maxRetries} for ${context} after ${delay}ms`);
          await this.sleep(delay);
        }
      }
    }
    
    throw new Error(`Max retries exceeded for ${context}: ${lastError?.message}`);
  }

  /**
   * Calcula delay com exponential backoff
   */
  private calculateDelay(attempt: number): number {
    const delay = Math.min(
      this.config.initialDelay * Math.pow(this.config.backoffMultiplier, attempt),
      this.config.maxDelay
    );
    
    // Adiciona jitter (variação aleatória de ±20%)
    const jitter = delay * 0.2 * (Math.random() - 0.5);
    return Math.floor(delay + jitter);
  }

  /**
   * Aguarda um período de tempo
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Incrementa contador de falhas
   */
  private incrementFailures(context: string): void {
    const state = this.getState(context);
    state.failures++;
    this.states.set(context, state);
  }

  /**
   * Reseta contador de falhas
   */
  private resetFailures(context: string): void {
    const state = this.getState(context);
    state.failures = 0;
    this.states.set(context, state);
  }

  /**
   * Obtém estado atual do rate limiter
   */
  private getState(context: string): RateLimitState {
    if (!this.states.has(context)) {
      this.states.set(context, {
        requestCount: 0,
        windowStart: Date.now(),
        failures: 0
      });
    }
    return this.states.get(context)!;
  }

  /**
   * Verifica se deve aguardar antes de fazer requisição
   */
  async checkRateLimit(context: string, maxRequests: number, windowMs: number): Promise<void> {
    const state = this.getState(context);
    const now = Date.now();
    
    // Reset window se passou o tempo
    if (now - state.windowStart > windowMs) {
      state.requestCount = 0;
      state.windowStart = now;
    }
    
    // Se atingiu o limite, aguarda
    if (state.requestCount >= maxRequests) {
      const waitTime = windowMs - (now - state.windowStart);
      if (waitTime > 0) {
        console.log(`[RateLimit] Waiting ${waitTime}ms for ${context}`);
        await this.sleep(waitTime);
        state.requestCount = 0;
        state.windowStart = Date.now();
      }
    }
    
    state.requestCount++;
    this.states.set(context, state);
  }
}

// Instância global
export const rateLimiter = new RateLimiter({
  maxRetries: 5,
  initialDelay: 5000, // 5 segundos inicial
  maxDelay: 60000,    // 60 segundos máximo
  backoffMultiplier: 2
});

// Rate limiters específicos para cada serviço
export const googleSheetsLimiter = new RateLimiter({
  maxRetries: 3,
  initialDelay: 7000, // 7 segundos para Google Sheets
  maxDelay: 30000,
  backoffMultiplier: 1.5
});

export const bigQueryLimiter = new RateLimiter({
  maxRetries: 5,
  initialDelay: 3000,
  maxDelay: 45000,
  backoffMultiplier: 2
});

export const evolutionApiLimiter = new RateLimiter({
  maxRetries: 4,
  initialDelay: 2000,
  maxDelay: 20000,
  backoffMultiplier: 1.8
});
