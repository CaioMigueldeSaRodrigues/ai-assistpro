import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './index.js';

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), 'migrations');

export async function migrate() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const alreadyApplied = await db.query(
      'SELECT 1 FROM schema_migrations WHERE version = $1',
      [file],
    );
    if (alreadyApplied.rowCount) continue;

    const sql = await readFile(join(migrationsDir, file), 'utf8');
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`Applied migration ${file}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

if (process.env.NODE_ENV !== 'test') {
  migrate()
    .then(() => db.end())
    .catch(async (error) => {
      console.error('Migration failed');
      console.error(error instanceof Error ? error.message : error);
      await db.end();
      process.exitCode = 1;
    });
}
