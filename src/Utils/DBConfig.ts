import knex from "knex";

export let DBConfig = knex({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'cutehusky',
        database: 'NEWSPAPER'
    }
})