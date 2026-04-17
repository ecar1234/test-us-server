import 'reflect-metadata';
import { DataSource } from "typeorm";
import * as mysql2 from "mysql2";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config();

import { MessagesEntity } from '../infrastructure/entities/MessagesEntities/MessageEntity.js';
import { RoomEntity } from '../infrastructure/entities/MessagesEntities/RoomEntity.js';
import { RoomMemberEntity } from "../infrastructure/entities/MessagesEntities/RoomMemberEntity.js";
import { BasePostEntity } from "../infrastructure/entities/PostEntities/BasePostEntity.js";
import { PromotionPostEntity } from "../infrastructure/entities/PostEntities/PromotionPostEntity.js";
import { RecruitmentPostEntity } from "../infrastructure/entities/PostEntities/RecruitmentPostEntity.js";
import { PostReviewEntity } from "../infrastructure/entities/PostReviewEntity.js";
import { ApplicationEntity } from "../infrastructure/entities/ApplicationEntity.js";
import { UserEntity } from "../infrastructure/entities/UserEntity.js";
import { UserReviewEntity } from "../infrastructure/entities/UserReviewEntiry.js";
import { FirebaseDeviceTokenEntity } from "../infrastructure/entities/FirebaseDeviceTokenEntity.js";
import { PurchaseEntity } from "../infrastructure/entities/PurchaseEntities/PurchaseEntity.js";
import { PurchaseIosEntity } from "../infrastructure/entities/PurchaseEntities/PurchaseIosEntity.js";
import { PurchaseAosEntity } from "../infrastructure/entities/PurchaseEntities/PurchaseAosEntity.js";
import { PurchaseEventLogs } from "../infrastructure/entities/PurchaseEventLog.js";


const isProd = process.env.NODE_ENV === "prod";
// 현재 파일의 전체 경로 (URL 객체를 파일 시스템 경로 문자열로 변환)
const __filename = fileURLToPath(import.meta.url);
// 현재 파일이 위치한 디렉토리 경로
const __dirname = path.dirname(__filename);

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
      path.join(__dirname, "..", "infrastructure/entities/**/*{.ts,.js}"),
      path.join(__dirname, "..", "infrastructure/entities/MessagesEntities/**/*{.ts,.js}"),
      path.join(__dirname, "..", "infrastructure/entities/PostEntities/**/*{.ts,.js}"),
      path.join(__dirname, "..", "infrastructure/entities/PurchaseEntities/**/*{.ts,.js}"),
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
      path.join(__dirname, "..", "infrastructure/entities/**/*{.ts,.js}"),
      path.join(__dirname, "..", "infrastructure/entities/MessagesEntities/**/*{.ts,.js}"),
    ],
    migrations: [
      path.join(__dirname, "..", "migration/*.ts"),
    ],
  });
}


export const AppDataSource: DataSource = isProd
  ? createMainDataSource()
  : createDevDataSource();
