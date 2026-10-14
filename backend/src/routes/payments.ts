import crypto from 'node:crypto';
import { Router } from 'express';
import { db } from '../db/index.js';
import { safeEqual } from '../middleware/auth.js';
import { httpRateLimit } from '../middleware/httpRateLimit.js';
import { getPaymentProvider } from '../services/paymentProvider.js';
import { PaymentSchema, PaymentWebhookSchema } from '../types/index.js';

export const paymentsRouter = Router();

const paymentRateLimit = httpRateLimit({ name: 'payments-process', maxRequests: 10, windowMs: 60 * 1000 });
export const webhookRateLimit = httpRateLimit({ name: 'payments-webhook', maxRequests: 30, windowMs: 60 * 1000 });

paymentsRouter.post('/process', paymentRateLimit, async (req, res, next) => {
  try {
    const data = PaymentSchema.parse(req.body);
    if (data.payment.method === 'credit_card' && !data.payment.card) {
      return res.status(400).json({ error: 'Card data is required for credit_card payments' });
    }
    const orderResult = await db.query(
      `INSERT INTO orders
       (user_id, customer_name, customer_email, customer_phone, customer_document,
        customer_company, plan, amount, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [req.user!.id, data.customer.name, data.customer.email, data.customer.phone,
        data.customer.document, data.customer.company, data.plan, data.amount, data.payment.method],
    );
    const orderId = Number(orderResult.rows[0].id);
    const provider = getPaymentProvider();
    const paymentResult = await provider.createPayment({
      amount: data.amount,
      orderId,
      method: data.payment.method,
      card: data.payment.card,
      customer: { name: data.customer.name, email: data.customer.email, document: data.customer.document },
    });
    await db.query('UPDATE orders SET payment_id = $1, status = $2, updated_at = NOW() WHERE id = $3',
      [paymentResult.paymentId, paymentResult.status, orderId]);
    if (paymentResult.status === 'approved') {
      await db.query(
        `INSERT INTO subscriptions (user_id, email, name, company, phone, plan, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'active')`,
        [req.user!.id, data.customer.email, data.customer.name, data.customer.company, data.customer.phone, data.plan],
      );
      await db.query('UPDATE users SET plan = $1, updated_at = NOW() WHERE id = $2', [data.plan, req.user!.id]);
    }
    return res.status(201).json({ orderId, status: paymentResult.status, paymentData: paymentResult.data, provider: provider.kind });
  } catch (error) {
    return next(error);
  }
});

paymentsRouter.get('/orders/:orderId', async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);
    if (!Number.isInteger(orderId) || orderId < 1) return res.status(400).json({ error: 'Invalid order id' });
    const result = await db.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [orderId, req.user!.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'Order not found' });
    return res.json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

paymentsRouter.get('/status/:orderId', async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);
    if (!Number.isInteger(orderId) || orderId < 1) return res.status(400).json({ error: 'Invalid order id' });
    const result = await db.query('SELECT status, payment_id FROM orders WHERE id = $1 AND user_id = $2', [orderId, req.user!.id]);
    if (!result.rowCount) return res.status(404).json({ error: 'Order not found' });
    return res.json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

paymentsRouter.post('/webhook', async (req, res, next) => {
  try {
    const secret = process.env.PAYMENT_WEBHOOK_SECRET;
    const signature = req.header('x-payment-signature');
    if (!secret || !signature) return res.status(401).json({ error: 'Webhook authentication required' });
    const expected = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
    if (!safeEqual(expected, signature)) return res.status(401).json({ error: 'Invalid webhook signature' });
    const data = PaymentWebhookSchema.parse(req.body);
    await db.query('UPDATE orders SET status = $1, payment_id = $2, updated_at = NOW() WHERE id = $3',
      [data.status, data.paymentId, data.orderId]);
    return res.json({ received: true });
  } catch (error) {
    return next(error);
  }
});
