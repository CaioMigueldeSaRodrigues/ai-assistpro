import { Router } from 'express';
import { db } from '../db/index.js';
import { PaymentSchema } from '../types/index.js';
import { generatePIXCode, processStripePayment } from '../services/payment.js';

export const paymentsRouter = Router();

// Process payment
paymentsRouter.post('/process', async (req, res, next) => {
  try {
    const data = PaymentSchema.parse(req.body);
    
    // Create order
    const orderResult = await db.query(
      `INSERT INTO orders (customer_name, customer_email, customer_phone, customer_document, 
       customer_company, plan, amount, payment_method, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       RETURNING *`,
      [
        data.customer.name,
        data.customer.email,
        data.customer.phone,
        data.customer.document,
        data.customer.company,
        data.plan,
        data.amount,
        data.payment.method,
        'pending'
      ]
    );

    const order = orderResult.rows[0];

    let paymentResult;
    
    if (data.payment.method === 'pix') {
      // Process PIX payment
      paymentResult = await generatePIXCode({
        amount: data.amount,
        orderId: order.id,
        customer: data.customer
      });
    } else {
      // Process credit card payment
      paymentResult = await processStripePayment({
        amount: data.amount,
        orderId: order.id,
        customer: data.customer,
        card: data.payment.card
      });
    }

    // Update order with payment details
    await db.query(
      'UPDATE orders SET payment_id = $1, status = $2 WHERE id = $3',
      [paymentResult.paymentId, paymentResult.status, order.id]
    );

    res.json({
      orderId: order.id,
      status: paymentResult.status,
      paymentData: paymentResult.data
    });
  } catch (error) {
    next(error);
  }
});

// Get order details
paymentsRouter.get('/orders/:orderId', async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const result = await db.query(
      'SELECT * FROM orders WHERE id = $1',
      [orderId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Generate PIX
paymentsRouter.post('/pix/generate', async (req, res, next) => {
  try {
    const { amount, customer } = req.body;
    
    const pixData = await generatePIXCode({
      amount,
      customer,
      orderId: `temp-${Date.now()}`
    });
    
    res.json(pixData);
  } catch (error) {
    next(error);
  }
});

// Check payment status
paymentsRouter.get('/status/:orderId', async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const result = await db.query(
      'SELECT status, payment_id FROM orders WHERE id = $1',
      [orderId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = result.rows[0];
    
    // Here you would check with payment provider (Stripe, Mercado Pago, etc.)
    // For now, simulate status check
    let status = order.status;
    if (status === 'pending' && Math.random() > 0.5) {
      status = 'approved';
      await db.query(
        'UPDATE orders SET status = $1 WHERE id = $2',
        ['approved', orderId]
      );
    }
    
    res.json({ status });
  } catch (error) {
    next(error);
  }
});

// Webhook for payment notifications
paymentsRouter.post('/webhook', async (req, res, next) => {
  try {
    const { orderId, status, paymentId } = req.body;
    
    await db.query(
      'UPDATE orders SET status = $1, payment_id = $2, updated_at = NOW() WHERE id = $3',
      [status, paymentId, orderId]
    );
    
    // Send confirmation email, update subscription, etc.
    
    res.json({ received: true });
  } catch (error) {
    next(error);
  }
});