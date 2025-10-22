import { RecruitmentPostUseCase } from "../../app/RecruitmentPostUseCase";
import { Request, Response } from "express";
import { getInitPostsQueue } from "../../config/RedisConfig";
import { PostUseCase } from "../../app/PostUseCase";

export class RecruitmentPostController {
    // PostUseCase를 주입받도록 수정
    constructor(
    
        private postUseCase: PostUseCase
    ) { }


}