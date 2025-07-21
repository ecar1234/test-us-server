import express from 'express';
import { AppDataSource } from './config/data_source';
import AuthRoute from './interface/routes/auth_route';
import UserRoute from './interface/routes/user_route'; 
import PostRoute from './interface/routes/post_route';

const app = express();
const port = 3000;

app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log("DB 연결 성공!!");

        app.listen(port, () => {
            console.log("서버 실행 중: http://localhost:3000");
            // API 라우트 설정
            app.use('/api/v1/auth', AuthRoute);
            app.use('/api/v1/user', UserRoute);
            app.use('/api/v1/post', PostRoute);
        });
    })
    .catch((error) => console.error("DB 연결 실패:", error));



export default app;