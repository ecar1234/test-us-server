
import * as env from 'dotenv';
import * as path from 'path';
env.config({ path: path.resolve(__dirname, '../../.env') });

export const Env = {
    DATA_BASE_USER_NAME: process.env.DATA_BASE_USER_NAME,
    DATA_BASE_PASSWORD: process.env.DATA_BASE_PASSWORD,
    DATA_BASE_NAME: process.env.DATA_BASE_NAME
};