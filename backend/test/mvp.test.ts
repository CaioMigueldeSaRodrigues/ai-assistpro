import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test, { after, before } from 'node:test';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/ai_agents';
process.env.JWT_SECRET ??= 'test-secret-that-is-longer-than-thirty-two-characters';
process.env.PAYMENT_MODE = 'sandbox';
process.env.PAYMENT_WEBHOOK_SECRET = 'test-webhook-secret-that-is-long-enough';
process.env.CORS_ORIGIN = 'http://localhost:5173';

const { createApp } = await import('../src/server.js');
const { db } = await import('../src/db/index.js');
const { defaultBotConfig } = await import('../src/routes/bot.js');

const app = createApp();
let server: ReturnType<typeof app.listen>;
let baseUrl = '';
const email = `mvp-${randomUUID()}@example.test`;
const secondEmail = `mvp-${randomUUID()}@example.test`;
const adminEmail = `admin-${randomUUID()}@example.test`;

before(async () => {
  server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Test server did not start');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await db.query('DELETE FROM users WHERE email IN ($1, $2, $3)', [email, secondEmail, adminEmail]);
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  await db.end();
});

async function request(path: string, options: RequestInit = {}) {
  return fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers ?? {}) },
  });
}

function cookieFrom(response: Response): string {
  const cookie = response.headers.get('set-cookie');
  assert.ok(cookie, 'authentication cookie should be returned');
  return cookie.split(';', 1)[0];
}

test('health is public and reports service status', async () => {
  const response = await request('/health');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'ok');
});

test('migrations create every MVP table', async () => {
  const result = await db.query(`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = ANY($1::text[])
  `, [['schema_migrations', 'users', 'subscriptions', 'orders', 'bot_configurations', 'chat_conversations']]);
  assert.equal(result.rows.length, 6);
});

test('register, login and me use an HttpOnly session cookie', async () => {
  const register = await request('/api/auth/register', {
    method: 'POST', body: JSON.stringify({ name: 'MVP User', email, password: 'correct horse battery staple' }),
  });
  assert.equal(register.status, 201);
  const cookie = cookieFrom(register);
  assert.match(register.headers.get('set-cookie') ?? '', /HttpOnly/);

  const me = await request('/api/auth/me', { headers: { cookie } });
  assert.equal(me.status, 200);
  assert.equal((await me.json()).user.email, email);

  const duplicate = await request('/api/auth/register', {
    method: 'POST', body: JSON.stringify({ name: 'MVP User', email, password: 'correct horse battery staple' }),
  });
  assert.equal(duplicate.status, 409);
});

test('invalid input is rejected by Zod', async () => {
  const response = await request('/api/auth/register', {
    method: 'POST', body: JSON.stringify({ name: 'x', email: 'not-an-email', password: 'short' }),
  });
  assert.equal(response.status, 400);
});

test('bot configuration, mock runtime and dashboard data are persisted per user', async () => {
  const login = await request('/api/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password: 'correct horse battery staple' }),
  });
  const cookie = cookieFrom(login);

  const saved = await request('/api/bot/config', {
    method: 'POST', headers: { cookie }, body: JSON.stringify({ ...defaultBotConfig, company: 'Persisted Company' }),
  });
  assert.equal(saved.status, 200);
  assert.equal((await saved.json()).runtime, 'MOCK');

  const tested = await request('/api/bot/test', {
    method: 'POST', headers: { cookie }, body: JSON.stringify({ message: 'oi' }),
  });
  assert.equal(tested.status, 200);
  assert.equal((await tested.json()).runtime, 'MOCK');

  const subscription = await request('/api/subscriptions', {
    method: 'POST', headers: { cookie },
    body: JSON.stringify({ email, name: 'MVP User', plan: 'pro' }),
  });
  assert.equal(subscription.status, 201);

  const metrics = await request('/api/kpi/metrics', { headers: { cookie } });
  assert.equal(metrics.status, 200);
  assert.equal((await metrics.json()).total_leads, 1);
});

test('sandbox payment is deterministic and order access is isolated', async () => {
  const login = await request('/api/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password: 'correct horse battery staple' }),
  });
  const cookie = cookieFrom(login);
  const payment = await request('/api/payments/process', {
    method: 'POST', headers: { cookie },
    body: JSON.stringify({
      plan: 'pro', amount: 99,
      customer: { name: 'MVP User', email, phone: '11999999999', document: '00000000000' },
      payment: { method: 'credit_card', card: { number: '4242424242424242', name: 'MVP User', expiry: '12/30', cvv: '123', installments: '1' } },
    }),
  });
  assert.equal(payment.status, 201);
  const paymentBody = await payment.json();
  assert.equal(paymentBody.provider, 'MOCK_SANDBOX');
  assert.equal(paymentBody.status, 'approved');

  const second = await request('/api/auth/register', {
    method: 'POST', body: JSON.stringify({ name: 'Other User', email: secondEmail, password: 'correct horse battery staple' }),
  });
  const secondCookie = cookieFrom(second);
  const forbiddenOrder = await request(`/api/payments/orders/${paymentBody.orderId}`, { headers: { cookie: secondCookie } });
  assert.equal(forbiddenOrder.status, 404);
});

test('payment webhook rejects unsigned requests', async () => {
  const response = await request('/api/payments/webhook', {
    method: 'POST', body: JSON.stringify({ orderId: 1, status: 'approved', paymentId: 'x' }),
  });
  assert.equal(response.status, 401);
});

test('leads routes require authentication and admin authorization', async () => {
  const unauthenticated = await request('/api/leads/00000000000000');
  assert.equal(unauthenticated.status, 401);

  const registered = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: 'Admin Test', email: adminEmail, password: 'correct horse battery staple' }),
  });
  assert.equal(registered.status, 201);
  const regularCookie = cookieFrom(registered);

  const regular = await request('/api/leads/00000000000000', { headers: { cookie: regularCookie } });
  assert.equal(regular.status, 403);

  const regularTrigger = await request('/api/leads/capture/trigger', {
    method: 'POST',
    headers: { cookie: regularCookie },
  });
  assert.equal(regularTrigger.status, 403);

  await db.query('UPDATE users SET role = $1 WHERE email = $2', ['admin', adminEmail]);
  const login = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: adminEmail, password: 'correct horse battery staple' }),
  });
  const adminCookie = cookieFrom(login);

  const adminTrigger = await request('/api/leads/capture/trigger', {
    method: 'POST',
    headers: { cookie: adminCookie },
  });
  assert.equal(adminTrigger.status, 200);
});

test('sensitive HTTP routes return 429 after the configured limit', async () => {
  let limitedResponse: Response | undefined;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const response = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: `rate-limit-${attempt}@example.test`, password: 'wrong-password' }),
    });
    if (response.status === 429) {
      limitedResponse = response;
      break;
    }
  }

  assert.ok(limitedResponse, 'login rate limit should return 429');
  assert.match(limitedResponse.headers.get('retry-after') ?? '', /^\d+$/);
  assert.equal((await limitedResponse.json()).error, 'Too many requests');
});
