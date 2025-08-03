import { DataSource } from "typeorm";
import { Env } from "./env";
import * as path from "path";

const env = Env;

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: env.DATA_BASE_USER_NAME,
    password: env.DATA_BASE_PASSWORD,
    database: env.DATA_BASE_NAME,
    synchronize: false, // dev용, 배포시 false
    logging: true,
    entities: [path.join(__dirname, "..", "infrastructure/entities/*.{js,ts}")],
    migrations: [path.join(__dirname, "..", "migration/*.{js,ts}")],
});