import "reflect-metadata";
import * as dotenv from 'dotenv';
dotenv.config(); // Worker 프로세스를 위해 환경 변수를 로드합니다.

import { AppDataSource } from '../config/DataSource.js';

AppDataSource.initialize().then(async() => {
    console.log("Workers: Database connection initialized successfully.");

    // 각 도메인별 워커를 임포트하여 실행합니다.
    await import('./ApplicationWorker.js');
    await import('./PostWorker.js');

}).catch((e) => {
    console.error("Workers: Error during database connection initialization.", e);
});