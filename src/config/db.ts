import { createPool, type Pool } from "mysql2/promise";

// DB 설정
export const pool: Pool = createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "ems",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  timezone: "+09:00",
  supportBigNumbers: true,
  bigNumberStrings: true,
  dateStrings: false,
});
