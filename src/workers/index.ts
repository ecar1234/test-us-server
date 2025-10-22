import * as dotenv from 'dotenv';
dotenv.config(); // Worker 프로세스를 위해 환경 변수를 로드합니다.

import { AppDataSource } from '../config/DataSource';

AppDataSource.initialize().then(() => {
    console.log("Workers: Database connection initialized successfully.");

    // 각 도메인별 워커를 임포트하여 실행합니다.
    require('./ApplicationWorker');
    require('./PostWorker');

}).catch((e) => {
    console.error("Workers: Error during database connection initialization.", e);
});