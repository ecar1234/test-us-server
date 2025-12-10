import cron from 'node-cron';
import { DailyTaskService } from '../DailyTaskSevice';
import { DbBackupService } from '../DbBackupService';


export const PostUpdateScheduledJob = () => {
    cron.schedule('0 0 0 * * *', async () => {
        try {
            // console.log('[DailyTask] test playing')
            await DailyTaskService.updateRecruitPosts();
            await DailyTaskService.updatePromotionPosts();
        } catch (error) {
            console.error('Scheduled job error:', error);
        }
    });
};

export const DbBackupScheduledJob = () => {
    cron.schedule('0 0 4 * * *', async () => {
        try {
            await DbBackupService.backupDB();
        } catch (e) {
            console.error('Scheduled job error:', e);
        }
    });
}