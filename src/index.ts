import * as dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';

const isProd = process.env.NODE_ENV === 'prod';
// dotenv.config({
//   path: path.resolve(process.cwd(), isProd ? '.env.main' : '.env'),
// });
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
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
import { DbBackupScheduledJob, ExpiredPostNotificationScheduledJob, ImageCleanupScheduledJob, PostUpdateScheduledJob } from './service/cron/ScheduledJob';
import { randomUUID } from 'crypto';
import { initSocket } from './service/socket.io';
import PurchaseRoute from './interface/routes/PurchaseRoute';

const app = express();
const httpServer = createServer(app);

const basePost = parseInt(process.env.SERVER_PORT) || 3000;
const instanceIdx = parseInt(process.env.NODE_APP_INSTANCE || '0');
const port = basePost + instanceIdx;


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// const uploadRoot = isProd
//   ? path.resolve(Env.MAIN_UPLOAD_URL)
//   : path.resolve(Env.UPLOAD_URL);

app.use('/posts', express.static(isProd ? path.resolve(process.env.MAIN_UPLOAD_URL) : path.resolve(process.env.UPLOAD_URL)));
app.use('/profile', express.static(isProd ? path.resolve(process.env.MAIN_UPLOAD_USER_URL) : path.resolve(process.env.UPLOAD_USER_URL)));
app.use('/backup', express.static(isProd ? path.resolve(process.env.MAIN_BACKUP_DB) : path.resolve(process.env.BACKUP_DB)));

// routes
app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/post', PostRoute);
app.use('/api/v1/application', ApplicationRoute);
app.use('/api/v1/review', ReviewRoute);
app.use('/api/v1/message', MessageRoute);
app.use('/api/v1/jobState', JobStateRoute);
app.use('/api/v1/firebase', FirebaseRoute);
app.use('/api/v1/purchase', PurchaseRoute);

//
app.use((req, res, next) => {
  req.id = randomUUID();
  console.log(`[REQ:${req.id}] ${req.method} ${req.url}`)
  next();
});
// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[REQ:${req.id}`,err);
  if (err.message.includes('already exists')) {
    res.status(409).json({ status: 409, message: 'data is already exists' });
    return;
  }
  if ((err as any).code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({ status: 413, message: 'File size too large' });
    return;
  }
  res.status(500).json({ status: 500, reqId: req.id, message: 'An unexpected error occurred' });
});

AppDataSource.initialize()
  .then(async () => {
    console.log(`[BOOT] DB 연결 성공 - ${new Date().toISOString()}`);
    console.log(`Current Environment: ${process.env.NODE_ENV}`);
    PostUpdateScheduledJob();
    DbBackupScheduledJob();
    ExpiredPostNotificationScheduledJob();
    ImageCleanupScheduledJob();

    await initSocket(httpServer);

    httpServer.listen(port, '127.0.0.1', () => {
      console.log(`서버 실행 중: 0.0.0.0:${port}`);
    });
  })
  .catch((err) => {
    console.error('DB 연결 실패:', err);
    process.exit(1);
  });

export default app;
