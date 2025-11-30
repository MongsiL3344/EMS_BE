import 'dotenv/config';
import { createPool, type Pool } from 'mysql2/promise';
// DB 설정
export const pool: Pool = createPool({
  host: process.env.DATABASE_HOST!,
  port: 15042,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PW!,
  database: process.env.DATABASE!,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  timezone: '+09:00',
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: false,
});
