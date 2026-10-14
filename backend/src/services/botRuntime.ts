import type { BotConfig } from '../types/index.js';

export interface BotRuntime {
  readonly kind: 'MOCK' | 'REAL';
  respond(input: { message: string; config: BotConfig }): Promise<string>;
}

export class MockBotRuntime implements BotRuntime {
  readonly kind = 'MOCK' as const;

  async respond({ message, config }: { message: string; config: BotConfig }): Promise<string> {
    const normalized = message.toLocaleLowerCase('pt-BR');
    if (normalized.includes('olá') || normalized.includes('oi')) {
      return config.messages.welcome.replace('{company}', config.company);
    }
    if (normalized.includes('preço') || normalized.includes('valor')) {
      return `SIMULAÇÃO: a ${config.company} possui planos diferentes. Posso apresentar as opções disponíveis.`;
    }
    if (normalized.includes('demo') || normalized.includes('demonstração')) {
      return `SIMULAÇÃO: posso registrar seu interesse em uma demonstração da ${config.company}.`;
    }
    return `SIMULAÇÃO: obrigado por entrar em contato com a ${config.company}. Como posso ajudar?`;
  }
}

export function getBotRuntime(): BotRuntime {
  return new MockBotRuntime();
}
