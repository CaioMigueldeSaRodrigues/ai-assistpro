import crypto from 'node:crypto';

export type PaymentStatus = 'pending' | 'approved' | 'declined';

export interface PaymentProvider {
  readonly kind: 'MOCK_SANDBOX' | 'REAL';
  createPayment(input: {
    amount: number;
    orderId: number;
    method: 'credit_card' | 'pix';
    card?: { number: string; name: string; expiry: string; cvv: string; installments: string };
    customer: { name: string; email: string; document: string };
  }): Promise<{ paymentId: string; status: PaymentStatus; data: Record<string, unknown> }>;
}

export class MockPaymentProvider implements PaymentProvider {
  readonly kind = 'MOCK_SANDBOX' as const;

  async createPayment(input: Parameters<PaymentProvider['createPayment']>[0]) {
    if (input.method === 'pix') {
      const pixKey = `sandbox-${crypto.randomUUID()}@example.invalid`;
      return {
        paymentId: `sandbox-pix-${input.orderId}`,
        status: 'pending' as const,
        data: {
          mode: 'MOCK_SANDBOX',
          pixKey,
          qrCode: `SANDBOX-PIX-${input.orderId}`,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          amount: input.amount,
        },
      };
    }

    if (!input.card) throw new Error('Card data is required for credit_card payments');
    return {
      paymentId: `sandbox-card-${input.orderId}`,
      status: 'approved' as const,
      data: {
        mode: 'MOCK_SANDBOX',
        transactionId: `sandbox-txn-${crypto.randomUUID()}`,
        last4: input.card.number.slice(-4),
        installments: Number(input.card.installments),
      },
    };
  }
}

export function getPaymentProvider(): PaymentProvider {
  if (process.env.PAYMENT_MODE !== 'sandbox') {
    throw new Error('Only PAYMENT_MODE=sandbox is available in the MVP');
  }
  return new MockPaymentProvider();
}
