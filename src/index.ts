import * as dotenv from 'dotenv';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';
dotenv.config({
  path: path.resolve(process.cwd(), isProd ? '.env.main' : '.env'),
});

import express, { Request, Response, NextFunction } from 'express';
import { AppDataSource } from './config/DataSource';
import AuthRoute from './interface/routes/AuthRoute';
import UserRoute from './interface/routes/UserRoute';
import ApplicationRoute from './interface/routes/ApplicationRoute';
import ReviewRoute from './interface/routes/ReviewRoute';
import MessageRoute from './interface/routes/MessageRoute';
import JobStateRoute from './interface/routes/JobStateRoute';
import FirebaseRoute from './interface/routes/FirebaseRoute';
import PostRoute from './interface/routes/PostRoute';
import { Env } from './config/env';
import { DbBackupScheduledJob, PostUpdateScheduledJob } from './service/cron/ScheduledJob';

const app = express();
const port = Number(process.env.SERVER_PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/posts', express.static(Env.UPLOAD_URL));
app.use('/profile', express.static(Env.UPLOAD_USER_URL));
app.use('/backup', express.static(Env.BACKUP_DB));

// routes
app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/post', PostRoute);
app.use('/api/v1/application', ApplicationRoute);
app.use('/api/v1/review', ReviewRoute);
app.use('/api/v1/message', MessageRoute);
app.use('/api/v1/jobState', JobStateRoute);
app.use('/api/v1/firebase', FirebaseRoute);

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err.message.includes('already exists')) {
    res.status(409).json({ status: 409, message: 'data is already exists' });
    return;
  }
  res.status(500).json({ status: 500, message: 'An unexpected error occurred' });
});

AppDataSource.initialize()
  .then(() => {
    console.log('DB 연결 성공!!');
    PostUpdateScheduledJob();
    DbBackupScheduledJob();

    app.listen(port, '0.0.0.0', () => {
      console.log(`서버 실행 중: 0.0.0.0:${port}`);
    });
  })
  .catch((err) => {
    console.error('DB 연결 실패:', err);
    process.exit(1);
  });

export default app;
