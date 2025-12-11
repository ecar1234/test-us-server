import { AppDataSource } from "../../config/DataSource";
import { BasePostStateType } from "../../infrastructure/entities/BasePostEntity";
import { PromotionPostEntity } from "../../infrastructure/entities/PromotionPostEntity";
import { RecruitmentPostEntity } from "../../infrastructure/entities/RecruitmentPostEntity";


export class DailyTaskService {
    static async updateRecruitPosts(): Promise<void> {
        try {
            const postRepository = AppDataSource.getRepository(RecruitmentPostEntity);
            const result = await postRepository
                .createQueryBuilder()
                .update(RecruitmentPostEntity)
                .set({ status: BasePostStateType.EXPIRED })
                .where("status = :status", { status: BasePostStateType.ACTIVE })
                .andWhere("DATE_ADD(createdAt, INTERVAL period DAY) < NOW()")
                .execute();
            console.log(`[DailyTask] Updated ${result.affected} posts to Expired status.`);
 

        }
        catch (e) {
            console.error('[DailyTask] Error during daily recruit post update:', e);
            throw e;
        }
    }
    static async updatePromotionPosts(): Promise<void> {
        try {
            const postRepository = AppDataSource.getRepository(PromotionPostEntity);
 
            const result = await postRepository
                .createQueryBuilder()
                .update(PromotionPostEntity)
                .set({ status: BasePostStateType.EXPIRED })
                .where("status = :status", { status: BasePostStateType.ACTIVE })
                .andWhere('DATE_ADD(createdAt, INTERVAL period DAY) < NOW()')
                .execute();
            console.log(`[DailyTask] Updated ${result.affected} promotion posts to Expired status.`);


         } catch (e) {
            console.error('[DailyTask] Error during daily promotion post update:', e);
            throw e;
        }
    }
}