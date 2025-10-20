
import IORedis from 'ioredis';
import { Queue } from 'bullmq';
import { RedisEnv } from './env';


const redisConfig = {
  port: parseInt(RedisEnv.REDIS_PORT || '6379'),
  host: RedisEnv.REDIS_HOST || 'localhost',
  // password: RedisEnv.REDIS_PASSWORD || '',
  maxRetriesPerRequest: null, 
};

export const redisClient = new IORedis(redisConfig);
export const getInitPostsQueue = new Queue('getInitPostsQueue', { 
  connection: redisClient, 
  defaultJobOptions: { 
    removeOnComplete: { age: 3600 } // 1시간 동안 결과 유지
  } 
});
export const getApplicationsByIdQueue = new Queue('getApplicationsByIdQueue', { 
  connection: redisClient, 
  defaultJobOptions: { 
    removeOnComplete: { age: 3600 } // 1시간 동안 결과 유지
  } 
});
