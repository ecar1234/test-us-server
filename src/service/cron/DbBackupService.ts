import fs from "fs";
import dayjs from "dayjs";
import path from "path";
import { exec } from "child_process";
import { Env } from "../../config/env.js";



export class DbBackupService {
    private static backupPath = Env.BACKUP_DB;

    public static async backupDB(): Promise<void> {
        //폴더가 없다면 생성
        if (!fs.existsSync(this.backupPath)) {
            fs.mkdirSync(this.backupPath, { recursive: true });
        }

        // 파일명 생성 (예: backup_2023-10-25_14-00-00.sql)
        const timestamp = dayjs().format('YYYY-MM-DD_HH-mm-ss');
        const fileName = `backup_${timestamp}.sql`;
        const filePath = path.join(this.backupPath, fileName);

        // 환경 변수에서 DB 정보 가져오기
        const DB_HOST = 'localhost';
        const DB_USER = Env.DATA_BASE_USER_NAME || 'root';
        const DB_PASS = Env.DATA_BASE_PASSWORD || 'password';
        const DB_NAME = Env.DATA_BASE_NAME || 'my_database';

        // mysqldump 명령어 구성
        // 주의: 보안을 위해 비밀번호가 노출되지 않도록 환경변수를 꼭 사용하세요.
        const command = `mysqldump -u "${DB_USER}" -p${DB_PASS} ${DB_NAME} > ${filePath}`;

        console.log(`[Backup] Starting backup: ${fileName}...`);

        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`[Backup] Error: ${error.message}`);
                    return reject(error);
                }
                if (stderr) {
                    // mysqldump는 성공해도 경고 메시지를 stderr로 뱉는 경우가 있어 주의 필요
                    console.log(`[Backup] Note: ${stderr}`);
                }
                console.log(`[Backup] Success! File saved at: ${filePath}`);
                resolve();
            });
        });
    }

}