import cron from 'node-cron';
import { DailyTaskService } from './DailyTaskSevice.js';
import { DbBackupService } from './DbBackupService.js';


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

export const ExpiredPostNotificationScheduledJob = () => {
    cron.schedule('0 0 9 * * *', async () => {
        try {
            await DailyTaskService.expiredPostsFcmToSend();
            await DailyTaskService.expiredPostsFcmToSend2();
        }catch (e) {
            console.error('Scheduled job error:', e);
        }
    });
}

export const ImageCleanupScheduledJob = () => {
    cron.schedule('0 0 3 * * *', async () => {
        try {
            await DailyTaskService.cleanupOrphanedPostImages();
            await DailyTaskService.cleanupOrphanedUserImages();
        } catch (e) {
            console.error('Scheduled job error:', e);
        }
    });
}

export const DbBackupScheduledJob = () => {
    cron.schedule('0 0 4 * * *', async () => {
        try {
            await DbBackupService.backupDB();
        } catch (e) {
            console.error('Scheduled job error:', e);
        }
    });
}
