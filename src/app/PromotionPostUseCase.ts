import { PromotionPostRepositoryImpl } from "../infrastructure/repositories/PromotionPostRepositoryImpl";


export class PromotionPostUseCase {
    constructor(private repository: PromotionPostRepositoryImpl) { }

}