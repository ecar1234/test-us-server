import express from 'express';
import { AppDataSource } from './config/DataSource';
import AuthRoute from './interface/routes/AuthRoute';
import UserRoute from './interface/routes/UserRoute'; 
import PostRoute from './interface/routes/PostRoute';
import ApplicationRoute from './interface/routes/ApplicationRoute';

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
            app.use('api/v1/application', ApplicationRoute);
        });
    })
    .catch((error) => console.error("DB 연결 실패:", error));



export default app;