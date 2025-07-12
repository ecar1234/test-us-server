import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DATA_BASE_NAME,
    password: process.env.DATA_BASE_PASSWORD,
    database: "test_us_database",
    synchronize: false, // dev용, 배포시 false
    logging: true,
    entities: ["./src/infrastructure/entities/*.ts"],
    migrations: ['./src/migration/*.ts'],
});