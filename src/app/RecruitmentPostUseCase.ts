import { ApplicationModel } from "../domain/entities/ApplicationModel";
import { RecruitmentPostModel } from "../domain/entities/RecruitmentPostModel";
import { UserEntity } from "../infrastructure/entities/UserEntity";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl";

export class RecruitmentPostUseCase {
    constructor(private postRepository: RecruitmentPostRepositoryImpl) { }


}