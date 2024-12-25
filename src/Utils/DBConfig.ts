import knex from "knex";
import * as dotenv from 'dotenv';
dotenv.config();

export let DBConfig = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD ?? '123456',
        database: process.env.DB_NAME || 'NEWSPAPER'
    }
})