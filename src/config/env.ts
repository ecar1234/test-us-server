
export const Env = {
    DATA_BASE_USER_NAME: process.env.DATA_BASE_USER_NAME,
    DATA_BASE_PASSWORD: process.env.DATA_BASE_PASSWORD,
    DATA_BASE_NAME: process.env.DATA_BASE_NAME,
    CRYPTION_KEY: process.env.CRYPTION_KEY,
    SERVER_PORT: process.env.SERVER_PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    UPLOAD_URL: process.env.UPLOAD_URL,
    UPLOAD_USER_URL: process.env.UPLOAD_USER_URL,
    BACKUP_DB: process.env.BACKUP_DB,
    // MIGRATION_PATH: process.env.MIGRATION_PATH
    MAIN_DATA_BASE_USER_NAME: process.env.MAIN_DATA_BASE_USER_NAME,
    MAIN_DATA_BASE_PASSWORD: process.env.MAIN_DATA_BASE_PASSWORD,
    MAIN_DATA_BASE_NAME: process.env.MAIN_DATA_BASE_NAME,
    MAIN_UPLOAD_URL: process.env.MAIN_UPLOAD_URL,
    MAIN_UPLOAD_USER_URL: process.env.MAIN_UPLOAD_USER_URL,
    MAIN_BACKUP_DB: process.env.MAIN_BACKUP_DB,

// # SERVER_PORT= '3000'
};
export const RedisEnv = {
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_PORT: process.env.REDIS_PORT
}

export const FirebaseEnv = {
    FIREBASE_ADMIN_ACCOUNT: process.env.FIREBASE_ADMIN_ACCOUNT,
}