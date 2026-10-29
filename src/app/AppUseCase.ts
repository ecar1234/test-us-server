import { ApplicationModel } from "../domain/entities/ApplicationModel.js";
import { RecruitmentPostModel } from "../domain/entities/RecruitmentPostModel.js";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl.js";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl.js";
import { sendNotificationToUser } from "../service/firebase/FcmService.js";
import { APNs, FCMPayload } from "../interface/interfaces/types.js";
import { FirebaseRepositoryImpl } from "../infrastructure/repositories/FirebaseRepositoryImpl.js";
import { TResRecruitTesterReviewInfo } from "../infrastructure/entities/package/UserReviewPackage.js";
import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl.js";
import { UserReviewRepositoryImpl } from "../infrastructure/repositories/UserReviewRepositoryImpl.js";
import { UserReviewModel } from "../domain/entities/UserReviewModel.js";
import { getAndroidMessage, getIosMessage } from "../utils/FcmUtil.js";
import { SideProjectPostRepositoryImpl } from "../infrastructure/repositories/SideProjectPostRepositoryImpl.js";
import { PostRepositoryImpl } from "../infrastructure/repositories/PostRepositoryImpl.js";
import { ProjectRoleRepositoryImpl } from "../infrastructure/repositories/ProjectRoleRepositoryImpl.js";
import { SideProjectPostModel } from "../domain/entities/SideProject/SideProjectPostModel.js";
// import { AppRecruitInfo, AppSideInfo } from "../domain/entities/interface/applicationPackage.js";

export class AppUseCase {
    constructor(
        private applicationRepository: ApplicationRepositoryImpl,
        private postRepository: RecruitmentPostRepositoryImpl,
        private sideRepo: SideProjectPostRepositoryImpl,
        private projectRoleRepo: ProjectRoleRepositoryImpl,
        private fireRepository: FirebaseRepositoryImpl,
        private userRepo: UserRepositoryImpl,
        private userReviewRepo: UserReviewRepositoryImpl
    ) { }

    async recruitAppCreate(userId: string, postId: string, platform: string, mobileOs: string, status: string = 'pending'): Promise<[ApplicationModel, RecruitmentPostModel]> {

        const application = new ApplicationModel({ platform: platform, mobileOs: mobileOs, status: status, postInfo: { postId: postId }, applicantId: userId });
        const appResult = await this.applicationRepository.create(application);
        if (appResult == null) {
            // console.log(appResult)
            throw new Error("application create failed");
        }
        const post = await this.postRepository.getPostById(appResult.postInfo.postId);
        const token = await this.fireRepository.getMessingToken(post.author['userId']);

        if (token) {
            let message: FCMPayload;
            if (token.deviceType === 'android') {
                message = getAndroidMessage(
                    token,
                    '새로운 신청',
                    `${post.title}에 새로운 신청이 등록 됐어요.\n신청 매뉴에서 확인해 보세요.`,
                    'recruit',
                    post.title,
                    token.user.userId);
            } else {
                message = getIosMessage(token,
                    '새로운 신청',
                    `${post.title}에 새로운 신청이 등록 됐어요.\n신청 매뉴에서 확인해 보세요.`,
                    'recruit',
                    post.title,
                    token.user.userId);
            }
            await sendNotificationToUser(message, token.user.userId);
        }

        // console.log(result)

        return [appResult, post];
    }

    async sideAppCreate(applicantId: string, postId: string, roleId: string, status: string = 'pending'): Promise<[ApplicationModel, SideProjectPostModel]> {
        const appModel = new ApplicationModel({
            platform: 'empty',
            status: status,
            postInfo: { postId: postId },
            applicantId: applicantId
        });

        const application = await this.applicationRepository.create(appModel);

        await this.projectRoleRepo.addRoleCount(parseInt(roleId));

        const post: SideProjectPostModel = await this.sideRepo.getProjectPostByPostId(application.postInfo.postId);

        const token = await this.fireRepository.getMessingToken(post.author['userId']);

        if (token) {
            let message: FCMPayload;
            if (token.deviceType === 'android') {
                message = getAndroidMessage(
                    token,
                    '새로운 신청',
                    `${post.title}에 새로운 신청이 등록 됐어요.\n신청 매뉴에서 확인해 보세요.`,
                    'side-project',
                    post.title,
                    token.user.userId
                );
            } else {
                message = getIosMessage(
                    token,
                    'TESTUS',
                    `${post.title}에 새로운 신청이 등록 됐어요.\n신청 매뉴에서 확인해 보세요.`,
                    'side-project',
                    post.title,
                    token.user.userId
                );
            }
            await sendNotificationToUser(message, token.user.userId);
        }

        // console.log(result)

        return [application, post];
    }

    /** recruit mobileOs 변경 전용으로 사용 */
    async updateApplication(id: string, postId: string, userId: string, platform: string, mobileOs: string, status: string): Promise<[ApplicationModel, RecruitmentPostModel]> {
        const application = new ApplicationModel({ id: parseInt(id), platform: platform, mobileOs: mobileOs, status: status, postInfo: { postId: postId }, applicantId: userId, appliedAt: null, updatedAt: null });
        // console.log(application);
        const appResult = await this.applicationRepository.update(application);
        if (appResult == null) {
            throw new Error("application update failed");
        }

        const post = await this.postRepository.getPostById(appResult.postInfo.postId);

        if (appResult.status === 'pending') {
            const applicatUser = await this.userRepo.findUserById(userId);

            const token = await this.fireRepository.getMessingToken(post.author['userId']);
            if (token) {
                let message: FCMPayload;
                if (token.deviceType === 'android') {
                    message = getAndroidMessage(
                        token,
                        '신청 변경',
                        `${applicatUser.nickname}님이 테스트 기기의 OS를 변경 했습니다\n신청 매뉴에서 확인해 보세요.`,
                        'recruit',
                        post.title,
                        token.user.userId
                    );
                } else {
                    message = getIosMessage(
                        token,
                        'TESTUS',
                        `${applicatUser.nickname}님이 테스트 기기의 OS를 변경 했습니다\n신청 매뉴에서 확인해 보세요.`,
                        'recruit',
                        post.title,
                        token.user.userId
                    );
                }
                await sendNotificationToUser(message, token.user.userId);
            }

        }
        // const post = await this.postRepository.getPostById(appResult.postInfo.postId);
        // console.log('use case result', result);
        return [appResult, post];
    }

    async cancelRecuitApp(id: string): Promise<[ApplicationModel, RecruitmentPostModel]> {
        const application = await this.applicationRepository.cancel(parseInt(id));
        if (application == null) {
            throw new Error("application cancel failed");
        }
        const post = await this.postRepository.getPostById(application.postInfo.postId);
        if (post == null) {
            throw new Error("post not found");
        }

        return [application, post];
    }
    async cancelSideApp(appId: string, roleId: string): Promise<[ApplicationModel, RecruitmentPostModel]> {

        const application = await this.applicationRepository.cancel(parseInt(appId));
        if (application == null) {
            throw new Error("application cancel failed");
        }
        await this.projectRoleRepo.substractRoleCount(parseInt(roleId));

        const post = await this.postRepository.getPostById(application.postInfo.postId);
        if (post == null) {
            throw new Error("post not found");
        }

        return [application, post];
    }

    async acceptUser(userId: string, postId: string): Promise<ApplicationModel> {
        const application = await this.applicationRepository.acceptUser(userId, postId);
        if (application == null) {
            throw new Error("application accept failed");
        }
        const post = await this.postRepository.getPostById(postId);
        if (post == null) {
            throw new Error("post not found");
        }
        const token = await this.fireRepository.getMessingToken(userId);

        if (token) {
                let message: FCMPayload;
                if (token.deviceType === 'android') {
                    message = getAndroidMessage(
                        token,
                        'TESTUS',
                        `요청하신 신청이 승인 되었습니다.\n관리 매뉴에서 확인해 보세요.`,
                        'application',
                        post.title,
                        token.user.userId
                    );
                } else {
                    message = getIosMessage(
                        token,
                        'TESTUS',
                        `요청하신 신청이 승인 되었습니다.\n관리 매뉴에서 확인해 보세요.`,
                        'recruit',
                        post.title,
                        token.user.userId
                    );
                }
                await sendNotificationToUser(message, token.user.userId);
            }
        return application;

    }

    async rejectUser(userId: string, postId: string): Promise<ApplicationModel> {
        const application = await this.applicationRepository.rejectUser(userId, postId);
        if (application == null) {
            throw new Error("application reject failed");
        }
        const post = await this.postRepository.getPostById(application.postInfo.postId);
        if (post == null) {
            throw new Error("post not found");
        }

        const token = await this.fireRepository.getMessingToken(userId);

        if (token) {
                let message: FCMPayload;
                if (token.deviceType === 'android') {
                    message = getAndroidMessage(
                        token,
                        'TESTUS',
                        `아쉽게도 ${post.title}에 등록한 요청이 거부되었어요.`,
                        'application',
                        post.title,
                        token.user.userId
                    );
                } else {
                    message = getIosMessage(
                        token,
                        'TESTUS',
                        `아쉽게도 ${post.title}에 등록한 요청이 거부되었어요.`,
                        'application',
                        post.title,
                        token.user.userId
                    );
                }
                await sendNotificationToUser(message, token.user.userId);
            }

        return application;
    }

    async findApplicationsByUserId(userId: string): Promise<ApplicationModel[]> {
        return this.applicationRepository.findApplicationsByUserId(userId);
    }

    async getTesterReviews(appIds: number[]): Promise<TResRecruitTesterReviewInfo[]> {
        const applications = await this.applicationRepository.getPostApplicantsInfo(appIds);
        if (applications.length === 0) return [];

        const users = await this.userRepo.findUsersByIds(applications.map(app => app.applicantId));
        const reviews = await this.userReviewRepo.getReviewsByApplicationIds(appIds);

        const result: TResRecruitTesterReviewInfo[] = [];

        applications.forEach(app => {
            const user = users.find(u => u.userId === app.applicantId);
            if (user) {
                const review: UserReviewModel | null = reviews.find(r => r.applicationId === app.id);
                result.push({
                    user: user,
                    review: review ? review : null,
                    appId: app.id
                });
            }
        });
        return result;
    }

}