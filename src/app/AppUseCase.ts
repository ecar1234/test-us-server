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

export class AppUseCase {
    constructor(
        private applicationRepository: ApplicationRepositoryImpl,
        private postRepository: RecruitmentPostRepositoryImpl,
        private fireRepository: FirebaseRepositoryImpl) { }

    async createApplication(userId: string, postId: string, platform: string, mobileOs: string, status: string = 'pending'): Promise<ApplicationModel> {
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
                    postTitle: post.title,
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
            await sendNotificationToUser(message);
        }

        // console.log(result)

        return appResult;
    }

    async updateApplication(id: string, postId: string, userId: string, platform: string, mobileOs: string, status: string): Promise<ApplicationModel> {
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
                        postTitle: post.title,
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
                await sendNotificationToUser(message);
            }

        }
        const post = await this.postRepository.getPostById(appResult.postId);
        // console.log('use case result', result);
        return appResult;
    }

    async cancelApplication(id: string): Promise<ApplicationModel> {

        const application = await this.applicationRepository.cancel(parseInt(id));
        if (application == null) {
            throw new Error("application cancel failed");
        }

        return application;
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
        const token = await this.fireRepository.getMessingToken(application.applicantId);

        if (token) {
            const message: FCMPayload = {
                token: token.token,
                notification: {
                    title: 'TESTS',
                    body: `${post.title}의 테스터 신청이 수락 됐습니다.\n함께 성장하는 테스트가 됐으면 좋겠네요.`
                },
                data: {
                    type: 'application',
                    postTitle: post.title,
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
            await sendNotificationToUser(message);
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

        const token = await this.fireRepository.getMessingToken(application.applicantId);

        if(token){
             const message: FCMPayload = {
            token: token.token,
            notification: {
                title: 'TESTUS',
                body: `아쉽게도 ${post.title}의 테스터 신청이 거절 됐습니다.\n다른 프로덕트에 다시 신청해 보세요.`
            },
            data: {
                type: 'application',
                postTitle: post.title,
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
        await sendNotificationToUser(message);
        }
       
        return application;
    }

    async findApplicationsByUserId(userId: string): Promise<ApplicationModel[]> {
        return this.applicationRepository.findApplicationsByUserId(userId);
    }

    async getRecruitApplications(applicationIds: number[]): Promise<ApplicationModel[]> {
        return this.applicationRepository.getRecruitApplications(applicationIds);
    }

}