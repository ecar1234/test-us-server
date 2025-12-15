import { parse } from "path";
import { ApplicationModel } from "../domain/entities/ApplicationModel";
import { RecruitmentPostModel } from "../domain/entities/RecruitmentPostModel";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { redisClient } from "../config/RedisConfig";
import { sendNotificationToUser } from "../service/firebase/FcmService";
import { APNs, FCMPayload } from "../interface/interfaces/types";
import { FirebaseRepositoryImpl } from "../infrastructure/repositories/FirebaseRepositoryImpl";

export class AppUseCase {
    constructor(private applicationRepository: ApplicationRepositoryImpl, private postRepository: RecruitmentPostRepositoryImpl, private fireRepository: FirebaseRepositoryImpl) { }

    async createApplication(userId: string, postId: string, platform: string, status: string = 'pending'): Promise<[ApplicationModel, RecruitmentPostModel]> {
        const result: [ApplicationModel, RecruitmentPostModel] = [null, null];
        const application = new ApplicationModel(null, platform, status, null, null, postId, userId);
        const appResult = await this.applicationRepository.create(application);
        if (appResult == null) {
            // console.log(appResult)
            throw new Error("application create failed");
        }
        const post = await this.postRepository.getPostById(appResult.postId);
        const token = await this.fireRepository.getMessingToken(userId);
        const message: FCMPayload = {
            token: token.token,
            notification: {
                title: '테스터 신청',
                body: '테스터 신청이 등록 됐습니다. 테스터 신청을 확인해 주세요.'
            },
            data: {
                postId: post.id,
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
                            body: '테스터 신청이 등록 됐습니다. 테스터 신청을 확인해 주세요.'
                        },
                        sound: 'default'
                    }
                }
            };
            message['apns'] = apns;
        }
        await sendNotificationToUser(message);
        if (post != null) {
            result[0] = appResult;
            result[1] = post;
        }
        // console.log(result)

        return result;
    }

    async updateApplication(id: string, postId: string, userId: string, platform: string, status: string): Promise<[ApplicationModel, RecruitmentPostModel]> {
        const result: [ApplicationModel, RecruitmentPostModel] = [null, null];
        const application = new ApplicationModel(parseInt(id), platform, status, null, null, postId, userId);
        // console.log(application);
        const appResult = await this.applicationRepository.update(application);
        if (appResult == null) {
            throw new Error("application update failed");
        }
        if (appResult.status === 'pending') {
            const post = await this.postRepository.getPostById(appResult.postId);
            const token = await this.fireRepository.getMessingToken(post.author['userId']);

            const message: FCMPayload = {
                token: token.token,
                notification: {
                    title: 'TESTUS',
                    body: '테스터 신청이 등록 됐습니다. 테스터 신청을 확인해 주세요.'
                },
                data: {
                    postId: post.id,
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
                                body: '테스터 신청이 등록 됐습니다. 테스터 신청을 확인해 주세요.'
                            },
                            sound: 'default'
                        }
                    }
                };
                message['apns'] = apns;
            }
            await sendNotificationToUser(message);
        }
        const post = await this.postRepository.getPostById(appResult.postId);
        if (post != null) {
            result[0] = appResult;
            result[1] = post;
        }
        // console.log('use case result', result);
        return result
    }

    async cancelApplication(id: string): Promise<[ApplicationModel, RecruitmentPostModel]> {
        const result: [ApplicationModel, RecruitmentPostModel] = [null, null];
        const application = await this.applicationRepository.cancel(parseInt(id));
        if (application == null) {
            throw new Error("application cancel failed");
        }
        const post = await this.postRepository.getPostById(application.postId);
        if (post != null) {
            result[0] = application;
            result[1] = post;

            // 캐시 무효화: 게시물 작성자의 게시물 목록 캐시를 삭제합니다.
            if (typeof post.author === 'object' && post.author !== null && 'userId' in post.author) {
                const authorId = post.author.userId;
                await redisClient.del(`userPosts:${authorId}`);
            }
        }
        // console.log(result);
        return result
    }

    async acceptUser(userId: string, postId: string): Promise<[ApplicationModel, RecruitmentPostModel]> {
        const application = await this.applicationRepository.acceptUser(userId, postId);
        if (application == null) {
            throw new Error("application accept failed");
        }
        const post = await this.postRepository.getPostById(postId);
        if (post == null) {
            throw new Error("post not found");
        }
        const token = await this.fireRepository.getMessingToken(application.applicantId);

        const message: FCMPayload = {
            token: token.token,
            notification: {
                title: 'TESTS',
                body: `${post.title}의 테스터 신청이 수락 됐습니다. 함께 성장하는 테스트가 됐으면 좋겠네요.`
            },
            data: {
                postId: post.id,
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
                            body: '테스터 신청이 등록 됐습니다. 테스터 신청을 확인해 주세요.'
                        },
                        sound: 'default'
                    }
                }
            };
            message['apns'] = apns;
        }

        await sendNotificationToUser(message);

        // 캐시 무효화: 게시물 작성자의 게시물 목록 캐시를 삭제합니다.
        if (typeof post.author === 'object' && post.author !== null && 'userId' in post.author) {
            const authorId = post.author.userId;
            await redisClient.del(`userPosts:${authorId}`);
        }
        return [application, post];

    }

    async rejectUser(userId: string, postId: string): Promise<[ApplicationModel, RecruitmentPostModel]> {
        const application = await this.applicationRepository.rejectUser(userId, postId);
        if (application == null) {
            throw new Error("application reject failed");
        }
        const post = await this.postRepository.getPostById(application.postId);
        if (post == null) {
            throw new Error("post not found");
        }

        const token = await this.fireRepository.getMessingToken(application.applicantId);

        const message: FCMPayload = {
            token: token.token,
            notification: {
                title: 'TESTUS',
                body: `아쉽게도 ${post.title}의 테스터 신청이 거절 됐습니다. 다른 프로덕트에 다시 신청해 보세요.`
            },
            data: {
                postId: post.id,
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
                            body: '테스터 신청이 등록 됐습니다. 테스터 신청을 확인해 주세요.'
                        },
                        sound: 'default'
                    }
                }
            };
            message['apns'] = apns;
        }
        await sendNotificationToUser(message);


        // 캐시 무효화: 게시물 작성자의 게시물 목록 캐시를 삭제합니다.
        if (typeof post.author === 'object' && post.author !== null && 'userId' in post.author) {
            const authorId = post.author.userId;
            await redisClient.del(`userPosts:${authorId}`);
        }
        return [application, post];
    }

    async findApplicationsByUserId(userId: string): Promise<ApplicationModel[]> {
        return this.applicationRepository.findApplicationsByUserId(userId);
    }

}