import { parse } from "path";
import { ApplicationModel } from "../domain/entities/ApplicationModel";
import { RecruitmentPostModel } from "../domain/entities/RecruitmentPostModel";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { redisClient } from "../config/RedisConfig";
import { sendNotificationToUser } from "../service/firebase/FcmService";
import { APNs, FCMPayload } from "../interface/interfaces/types";
import { FirebaseRepositoryImpl } from "../infrastructure/repositories/FirebaseRepositoryImpl";
import { app } from "firebase-admin";
import { TResRecruitTesterReviewInfo } from "../infrastructure/entities/package/UserReviewPackage";
import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl";
import { UserReviewRepositoryImpl } from "../infrastructure/repositories/UserReviewRepositoryImpl";
import { UserReviewModel } from "../domain/entities/UserReviewModel";

export class AppUseCase {
    constructor(
        private applicationRepository: ApplicationRepositoryImpl,
        private postRepository: RecruitmentPostRepositoryImpl,
        private fireRepository: FirebaseRepositoryImpl,
        private userRepo: UserRepositoryImpl,
        private userReviewRepo: UserReviewRepositoryImpl
    ) { }

    async createApplication(userId: string, postId: string, platform: string, mobileOs: string, status: string = 'pending'): Promise<[ApplicationModel, RecruitmentPostModel]> {
        const application = new ApplicationModel(null, platform, mobileOs, status, null, null, postId, userId);
        const appResult = await this.applicationRepository.create(application);
        if (appResult == null) {
            // console.log(appResult)
            throw new Error("application create failed");
        }
        const post = await this.postRepository.getPostById(appResult.postId);
        const token = await this.fireRepository.getMessingToken(post.author['userId']);
        if (token) {
            const message: FCMPayload = {
                token: token.token,
                notification: {
                    title: '테스터 신청',
                    body: `${post.title} 프로덕트에 테스터 신청이 등록 됐습니다.\n테스터 신청을 확인해 주세요.`
                },
                data: {
                    type: 'recruit',
                    title: post.title,
                    userId: userId
                },
            };
            if (token.deviceType === 'ios') {
                const apns: APNs = {
                    headers: {
                        'apns-priority': '10'
                    },
                    payload: {
                        aps: {
                            alert: {
                                title: 'TESTUS',
                                body: `${post.title} 프로덕트에 테스터 신청이 등록 됐습니다.\n테스터 신청을 확인해 주세요.`
                            },
                            sound: 'default',

                        }
                    }
                };
                message['apns'] = apns;
            }
            await sendNotificationToUser(message, token.user.userId);
        }

        // console.log(result)

        return [appResult, post];
    }

    async updateApplication(id: string, postId: string, userId: string, platform: string, mobileOs: string, status: string): Promise<[ApplicationModel, RecruitmentPostModel]> {
        const application = new ApplicationModel(parseInt(id), platform, mobileOs, status, null, null, postId, userId);
        // console.log(application);
        const appResult = await this.applicationRepository.update(application);
        if (appResult == null) {
            throw new Error("application update failed");
        }
        if (appResult.status === 'pending') {
            const post = await this.postRepository.getPostById(appResult.postId);
            const token = await this.fireRepository.getMessingToken(post.author['userId']);
            if (token) {
                const message: FCMPayload = {
                    token: token.token,
                    notification: {
                        title: 'TESTUS',
                        body: `${post.title} 프로덕트에 테스터 신청이 등록 됐습니다.\n테스터 신청을 확인해 주세요.`
                    },
                    data: {
                        type: 'recruit',
                        title: post.title,
                        userId: userId
                    },
                };
                if (token.deviceType === 'ios') {
                    const apns: APNs = {
                        headers: {
                            'apns-priority': '10'
                        },
                        payload: {
                            aps: {
                                alert: {
                                    title: 'TESTUS',
                                    body: `${post.title} 프로덕트에 테스터 신청이 등록 됐습니다.\n테스터 신청을 확인해 주세요.`
                                },
                                sound: 'default'
                            }
                        }
                    };
                    message['apns'] = apns;
                }
                await sendNotificationToUser(message, token.user.userId);
            }

        }
        const post = await this.postRepository.getPostById(appResult.postId);
        // console.log('use case result', result);
        return [appResult, post];
    }

    async cancelApplication(id: string): Promise<[ApplicationModel, RecruitmentPostModel]> {

        const application = await this.applicationRepository.cancel(parseInt(id));
        if (application == null) {
            throw new Error("application cancel failed");
        }
        const post = await this.postRepository.getPostById(application.postId);
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
            const message: FCMPayload = {
                token: token.token,
                notification: {
                    title: 'TESTS',
                    body: `${post.title}의 테스터 신청이 수락 됐습니다.\n함께 성장하는 테스트가 됐으면 좋겠네요.`
                },
                data: {
                    type: 'application',
                    title: post.title,
                    userId: userId
                }
            }
            if (token.deviceType === 'ios') {
                const apns: APNs = {
                    headers: {
                        'apns-priority': '10'
                    },
                    payload: {
                        aps: {
                            alert: {
                                title: 'TESTUS',
                                body: `${post.title}의 테스터 신청이 수락 됐습니다.\n함께 성장하는 테스트가 됐으면 좋겠네요.`
                            },
                            sound: 'default'
                        }
                    }
                };
                message['apns'] = apns;
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
        const post = await this.postRepository.getPostById(application.postId);
        if (post == null) {
            throw new Error("post not found");
        }

        const token = await this.fireRepository.getMessingToken(userId);

        if(token){
             const message: FCMPayload = {
            token: token.token,
            notification: {
                title: 'TESTUS',
                body: `아쉽게도 ${post.title}의 테스터 신청이 거절 됐습니다.\n다른 프로덕트에 다시 신청해 보세요.`
            },
            data: {
                type: 'application',
                title: post.title,
                userId: userId
            }
        }
        if (token.deviceType === 'ios') {
            const apns: APNs = {
                headers: {
                    'apns-priority': '10'
                },
                payload: {
                    aps: {
                        alert: {
                            title: 'TESTUS',
                            body: `아쉽게도 ${post.title}의 테스터 신청이 거절 됐습니다.\n다른 프로덕트에 다시 신청해 보세요.`
                        },
                        sound: 'default'
                    }
                }
            };
            message['apns'] = apns;
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
                    user: {
                        userId: user.userId,
                        email: user.email,
                        nickname: user.nickname,
                        profileImg: user.profileImg,
                        userType: user.userType,
                        role: user.role
                    },
                    review: review ? review : null,
                    appId: app.id
                });
            }
        });
        return result;
    }

}