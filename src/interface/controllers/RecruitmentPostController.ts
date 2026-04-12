import { PostUseCase } from "../../app/PostUseCase.js";

export class RecruitmentPostController {
    // PostUseCase를 주입받도록 수정
    constructor(
    
        private postUseCase: PostUseCase
    ) { }


}