import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl.js";

export class RecruitmentPostUseCase {
    constructor(private postRepository: RecruitmentPostRepositoryImpl) { }


}