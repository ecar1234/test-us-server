import 'reflect-metadata';
import { DataSource } from "typeorm";
import * as mysql2 from "mysql2";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config();

// 1. 부모 엔티티 최상단 import (초기화 순서 보장)
import { BasePostEntity } from "../infrastructure/entities/PostEntities/BasePostEntity.js";
import { PurchaseEntity } from "../infrastructure/entities/PurchaseEntities/PurchaseEntity.js";

// 2. 자식 및 연관 엔티티 import
// import { CoffeeChatPostEntity } from "../infrastructure/entities/PostEntities/CoffeeChatPostEntity.js";
import { PromotionPostEntity } from "../infrastructure/entities/PostEntities/PromotionPostEntity.js";
import { RecruitmentPostEntity } from "../infrastructure/entities/PostEntities/RecruitmentPostEntity.js";
import { SideProjectPostEntity } from "../infrastructure/entities/PostEntities/SideProject/SideProjectPostEntity.js";
import { ProjectRoleEntity } from "../infrastructure/entities/PostEntities/SideProject/ProjectRoleEntity.js";

import { PurchaseIosEntity } from "../infrastructure/entities/PurchaseEntities/PurchaseIosEntity.js";
import { PurchaseAosEntity } from "../infrastructure/entities/PurchaseEntities/PurchaseAosEntity.js";

import { RoomEntity } from '../infrastructure/entities/MessagesEntities/RoomEntity.js';
import { RoomMemberEntity } from "../infrastructure/entities/MessagesEntities/RoomMemberEntity.js";
import { MessagesEntity } from '../infrastructure/entities/MessagesEntities/MessageEntity.js';

import { UserEntity } from "../infrastructure/entities/UserEntity.js";
import { ApplicationEntity } from "../infrastructure/entities/ApplicationEntity.js";
import { FirebaseDeviceTokenEntity } from "../infrastructure/entities/FirebaseDeviceTokenEntity.js";
import { ImagesEntity } from "../infrastructure/entities/ImagesEntity.js";
import { PostReviewEntity } from "../infrastructure/entities/PostReviewEntity.js";
import { UserReviewEntity } from "../infrastructure/entities/UserReviewEntity.js";
// import { PurchaseEventLog } from "../infrastructure/entities/PurchaseEventLog.js";

const isProd = process.env.NODE_ENV === "prod";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 부모 엔티티가 배열 내에서 자식 엔티티보다 앞에 위치해야 함
const entityList = [
  // 1. 부모 클래스 우선 배치
  BasePostEntity,
  PurchaseEntity,

  // 2. 상속받는 자식 클래스 배치
  // CoffeeChatPostEntity,
  PromotionPostEntity,
  RecruitmentPostEntity,
  SideProjectPostEntity,
  ProjectRoleEntity,
  PurchaseIosEntity,
  PurchaseAosEntity,

  // 3. 기타 참조/독립 클래스 배치
  UserEntity,
  RoomEntity,
  RoomMemberEntity,
  MessagesEntity,
  ApplicationEntity,
  FirebaseDeviceTokenEntity,
  ImagesEntity,
  PostReviewEntity,
  UserReviewEntity,
  // PurchaseEventLog,
];

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
    entities: entityList,
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
    entities: entityList,
    migrations: [
      path.join(__dirname, "..", "migration/*.ts"),
    ],
  });
}

export const AppDataSource: DataSource = isProd
  ? createMainDataSource()
  : createDevDataSource();