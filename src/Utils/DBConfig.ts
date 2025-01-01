import knex from 'knex';
import * as dotenv from 'dotenv';
dotenv.config();

export let DBConfig = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD ?? 'cutehusky',
        database: process.env.DB_NAME || 'NEWSPAPER',
        timezone: '+07:00'
    },
});

export const TimeOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
};