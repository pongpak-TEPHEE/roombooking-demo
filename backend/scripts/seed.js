// Usage: npm run seed   (drops and recreates all tables with demo data)
import 'dotenv/config';
import { pool } from '../src/config/db.js';
import { resetDemoData } from '../src/demo/seed.js';

try {
  await resetDemoData(pool);
} catch (err) {
  console.error('❌ Seed failed:', err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
