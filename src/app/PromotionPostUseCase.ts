import { PromotionPostRepositoryImpl } from "../infrastructure/repositories/PromotionPostRepositoryImpl";


export class PromotionPostUseCase {
    constructor(private repository: PromotionPostRepositoryImpl) { }

    async getPostById(id: string): Promise<any> {
        return this.repository.getPostById(id);
    }

}