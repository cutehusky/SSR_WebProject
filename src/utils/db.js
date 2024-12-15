import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

export default knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'ecdb',
  },
  pool: { min: 0, max: 7 }
});