import { CoffeeChatPostModel } from "../../domain/entities/CoffeeChatPostModel.js";
import { ICoffeeChatPostRepository } from "../../domain/interface_repositories/ICoffeeChatPostRepository.js";


export class CoffeeChatPostRepositoryImpl implements ICoffeeChatPostRepository {
    save(post: CoffeeChatPostModel): Promise<CoffeeChatPostModel> {
        throw new Error("Method not implemented.");
    }
    getProjectPostByPostId(postId: string): Promise<CoffeeChatPostModel> {
        throw new Error("Method not implemented.");
    }
    getProjectPostsByUserId(userId: string): Promise<CoffeeChatPostModel[]> {
        throw new Error("Method not implemented.");
    }
    getProjectApplicantsByPostId(postId: string): Promise<number[]> {
        throw new Error("Method not implemented.");
    }
    getPostsPagination(page: number): Promise<CoffeeChatPostModel[]> {
        throw new Error("Method not implemented.");
    }

}