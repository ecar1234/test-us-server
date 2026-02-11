import { DataSource } from "typeorm";
import * as mysql2 from "mysql2";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();


const isProd = process.env.NODE_ENV === "prod";

const createMainDataSource = () => {
  console.log(`[DataSource] 🚀 Initializing PRODUCTION DataSource (DB: ${process.env.MAIN_DATA_BASE_NAME})`);
  return new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.MAIN_DATA_BASE_USER_NAME,
    password: process.env.MAIN_DATA_BASE_PASSWORD,
    database: process.env.MAIN_DATA_BASE_NAME,
    synchronize: false,
    logging: true,
    driver: mysql2,
    entities: [
      path.join(__dirname, "..", "infrastructure/entities/*.js"),
      path.join(__dirname, "..", "infrastructure/entities/MessagesEntities/*.js"),
    ],
    migrations: [
      path.join(__dirname, "..", "migration/*.js"),
    ],
  });
}

const createDevDataSource = () => {
  console.log(`[DataSource] 🛠️ Initializing DEVELOPMENT DataSource (DB: ${process.env.DATA_BASE_NAME})`);
  return new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DATA_BASE_USER_NAME,
    password: process.env.DATA_BASE_PASSWORD,
    database: process.env.DATA_BASE_NAME,
    synchronize: false,
    logging: true,
    driver: mysql2,
    entities: [
      path.join(__dirname, "..", "infrastructure/entities/*.ts"),
      path.join(__dirname, "..", "infrastructure/entities/MessagesEntities/*.ts"),
    ],
    migrations: [
      path.join(__dirname, "..", "migration/*.ts"),
    ],
  });
}


export const AppDataSource: DataSource = isProd
  ? createMainDataSource()
  : createDevDataSource();
