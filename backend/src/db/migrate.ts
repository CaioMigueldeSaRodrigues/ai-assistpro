import { db } from './index.js';

async function migrate() {
  console.log('🔄 Running database migrations...');

  try {
    // Create subscriptions table
    await db.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        phone VARCHAR(50),
        plan VARCHAR(50) NOT NULL CHECK (plan IN ('basic', 'pro', 'enterprise')),
        cnae VARCHAR(20),
        message TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Subscriptions table created');

    // Create contacts table
    await db.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(500) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Contacts table created');

    // Create orders table
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50),
        customer_document VARCHAR(50) NOT NULL,
        customer_company VARCHAR(255),
        plan VARCHAR(50) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(20) NOT NULL,
        payment_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Orders table created');

    // Create bot_configurations table
    await db.query(`
      CREATE TABLE IF NOT EXISTS bot_configurations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        bot_name VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        industry VARCHAR(100),
        description TEXT,
        personality VARCHAR(50),
        tone VARCHAR(50),
        language VARCHAR(10),
        working_hours JSONB,
        business_rules JSONB,
        integrations JSONB,
        messages JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Bot configurations table created');

    // Create indexes
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON subscriptions(created_at);
      CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
      CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
      CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
      CREATE INDEX IF NOT EXISTS idx_bot_configurations_user_id ON bot_configurations(user_id);
    `);
    console.log('✅ Indexes created');

    console.log('✅ All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
