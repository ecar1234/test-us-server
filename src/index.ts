import express, { Request, Response, NextFunction } from 'express';
import { AppDataSource } from './config/DataSource';
import AuthRoute from './interface/routes/AuthRoute';
import UserRoute from './interface/routes/UserRoute'; 
import PostRoute from './interface/routes/PostRoute';
import ApplicationRoute from './interface/routes/ApplicationRoute';
import ReviewRoute from './interface/routes/ReviewRoute';
import MessageRoute from './interface/routes/MessageRoute';
import { isHttpError } from 'http-errors';

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
            app.use('/api/v1/application', ApplicationRoute);
            app.use('/api/v1/review', ReviewRoute);
            app.use('/api/v1/message', MessageRoute);

            // 중앙 에러 처리 미들웨어
            app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
                console.error(err); // 서버 로그에 에러 기록
                if(err.message.includes('already exists')){
                    res.status(409).json({status: 409, message: 'data is already exists'});
                    return;
                }
                res.status(500).json({
                    status: 500,
                    message: 'An unexpected error occurred'
                });
                return;
            });
        });
    })
    .catch((error) => console.error("DB 연결 실패:", error));



export default app;