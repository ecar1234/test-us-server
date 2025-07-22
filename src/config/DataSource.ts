import { DataSource } from "typeorm";
import { Env } from "./env";

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
    entities: ["./src/infrastructure/entities/*.ts"],
    migrations: ['./src/migration/*.ts'],
});