import { DataSource } from "typeorm";
import { Env } from "./env";
import * as mysql2 from "mysql2";
import * as path from "path";

const env = Env;

console.log('--- Diagnostics from DataSource.ts ---');
console.log('Env object being used:', env);

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: env.DATA_BASE_USER_NAME,
    password: env.DATA_BASE_PASSWORD,
    database: env.DATA_BASE_NAME,
    synchronize: false, // dev용, 배포시 false
    logging: true,
    driver: mysql2,
    // authPlugins: {
    //     mysql_native_password: () => require('mysql2/lib/auth_plugins/mysql_native_password')({}),
    // },
    entities: [path.join(__dirname, "..", "infrastructure/entities/*.{js,ts}")],
    migrations: [path.join(__dirname, "..", "migration/*.{js,ts}")],
});