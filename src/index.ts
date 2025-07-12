import express from 'express';
import { AppDataSource } from './config/data_source';

const app = express();
const port = 3000;

app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log("DB 연결 성공!!");

        app.listen(3000, () => {
            console.log("서버 실행 중: http://localhost:3000");
        });
    })
    .catch((error) => console.error("DB 연결 실패:", error));