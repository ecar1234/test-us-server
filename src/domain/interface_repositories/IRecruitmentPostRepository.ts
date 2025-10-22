import { RecruitmentPostModel } from "../entities/RecruitmentPostModel";

export interface IRecruitmentPostRepository {
    createPost(post: RecruitmentPostModel): Promise<RecruitmentPostModel>;
    updatePost(post: RecruitmentPostModel): Promise<RecruitmentPostModel>;
    deletePost(id: string): Promise<boolean>;
    getPostById(id: string): Promise<RecruitmentPostModel>;
    getUserRecuritmentPosts(userId: string): Promise<RecruitmentPostModel[]>;
    getPostByTitle(title: string): Promise<RecruitmentPostModel>;
    getPostsByAuthor(authorId: string): Promise<RecruitmentPostModel[]>;
    getPostsPaginations(page: number): Promise<RecruitmentPostModel[]>;
    // getPostsByNickname(nickname: string): Promise<PostModel[]>;
    // getAllPosts(): Promise<PostModel[]>;
    // 닉네임으로 찾기, 게시물의 속한 리뷰 보기 추가가 필요해 보임
}