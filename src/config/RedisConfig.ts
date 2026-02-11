
import IORedis from 'ioredis';
import { Queue } from 'bullmq';
import { RedisEnv } from './env';

const isProd = process.env.NODE_ENV === "prod";

const baseConfig = {
  port: parseInt(RedisEnv.REDIS_PORT || '6379'),
  host: RedisEnv.REDIS_HOST || 'localhost',
  // password: RedisEnv.REDIS_PASSWORD || '',
  maxRetriesPerRequest: null,
};

// 1. 일반 앱 캐시용 (Prefix 사용) - AppUseCase 등에서 사용
export const redisClient = new IORedis({
  ...baseConfig,
  keyPrefix: isProd ? 'prod:' : 'dev:'
});

export const redisOtp = redisClient;

// 2. BullMQ용 커넥션 (Prefix 미사용 - BullMQ 제약사항 준수)
export const bullMqConnection = new IORedis(baseConfig);

const queueConfig = {
  connection: bullMqConnection,
  prefix: isProd ? 'prod:bull' : 'dev:bull', // BullMQ 내부 Prefix 설정으로 격리
  defaultJobOptions: {
    removeOnComplete: { age: 300 } // 1시간 동안 결과 유지
  } 
};

export const getInitPostsQueue = new Queue('getInitPostsQueue', queueConfig);
export const getApplicationsByIdQueue = new Queue('getApplicationsByIdQueue', queueConfig);
