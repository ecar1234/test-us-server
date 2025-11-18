import { RecruitmentPostModel } from "../domain/entities/RecruitmentPostModel";
import { TResUserAndReivews, UserModel } from "../domain/entities/UserModel";
import { UserStatus } from "../infrastructure/entities/UserEntity";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { ReviewRepositoryImpl } from "../infrastructure/repositories/ReviewRepositoryImpl";
import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { Env } from "../config/env";
import { ImagesModel } from "../domain/entities/ImagesModel"
import uuid from 'uuid';



interface UploadedImageInfo {
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    url: string;
}

interface ImageToDelete {
    filename: string;
    url: string;
}


export class UserUseCase {
    constructor(private userRepo: UserRepositoryImpl, private postRepo: RecruitmentPostRepositoryImpl, private reviewRepo: ReviewRepositoryImpl) { }

    async registerUser(email: string, nickname: string, password: string, userType: string, role: string, userName: string, birth: Date, profileImg?: UploadedImageInfo, method: string = 'EMAIL'): Promise<[UserModel, number]> {
        const findUser = await this.userRepo.findUserByEmail(email);
        if (findUser) {
            return [findUser, 409];
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new UserModel(null, email, nickname, passwordHash, userType, UserStatus.ACTIVE, role, userName, birth, profileImg, method);
        return [await this.userRepo.registerUser(user), 200];
    }
    async authUserRegister(email: string, nickname: string, profileUrl: string, userType: string, role: string, method: string): Promise<UserModel> {
        const user = new UserModel(
            null,
            email,
            nickname?? `User${uuid.v4}`,
            'authUserRegister',
            userType,
            UserStatus.ACTIVE,
            role, 
            null,
            null, 
            { url: profileUrl, filename: null, originalname: null, mimetype: null, size: null },
            method
        );
        return await this.userRepo.registerUser(user);
    }
    async deleteUser(userId: string): Promise<[boolean, string]> {
        // console.log(userId);
        // const user = await this.userRepo.findUserByEmail(userId);
        // if (!user) {
        //     return [false, "User not found"];
        // }

        const isDeleted = await this.userRepo.deleteUser(userId);
        if (!isDeleted) {
            return [false, "Failed to delete user"];
        }
        return [true, "User deleted successfully"];
    }
    async updateUserInfo(userId: string, nickname: string, userType: string, role: string, userName: string, birth: Date,method: string = 'EMAIL'): Promise<UserModel> {
        // console.log("use case : ", birth);
        const user = new UserModel(userId, null, nickname, null, userType, null, role, userName, birth, null, method);
        return this.userRepo.updateUserInfo(user);
    }
    async updateUserInfoWithImg(userId: string, nickname: string, userType: string, role: string, userName: string, birth: Date, image: UploadedImageInfo, oldImage?: UploadedImageInfo, method: string = "EMAIL"): Promise<UserModel> {
        const user = new UserModel(userId, null, nickname, null, userType, null, role, userName, birth, image, method);
        if (oldImage && oldImage.url) {
            try {
                // 이전 이미지의 URL에서 파일명을 추출하여 삭제합니다.
                const filename = path.basename(new URL(oldImage.url).pathname);
                const imagePath = path.join(Env.UPLOAD_USER_URL, filename);
                await fs.promises.unlink(imagePath);
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    console.error(`Failed to delete image file: ${error.message}`);
                }
            }
        }

        return this.userRepo.updateUserInfo(user);
    }
    async getUserById(userId: string): Promise<UserModel | null> {
        return this.userRepo.findUserById(userId);
    }
    async getUsersByIds(userIds: string[]): Promise<TResUserAndReivews[]> {
        const users = await this.userRepo.findUsersByIds(userIds);
        const reviews = await this.reviewRepo.getUserReviewAverage(userIds);
        // console.log('use case : ', users);
        return users.map(user => {
            const userReviews = reviews.filter(review => review.reviewerUserId === user.userId);
            const averageRating = userReviews.length > 0 ? userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length : 0;
            return { user, averageRating, reviewCount: userReviews.length };
        });
    }
    async getUserByEmail(email: string): Promise<UserModel | null> {
        return this.userRepo.findUserByEmail(email);
    }
    async getUserByNickname(nickname: string): Promise<UserModel | null> {
        return this.userRepo.findUserByNickname(nickname);
    }
    async getPostsByNickname(nickname: string): Promise<RecruitmentPostModel[]> {
        // 1. 닉네임으로 사용자 정보를 조회하여 userId를 얻습니다.
        const user = await this.userRepo.findUserByNickname(nickname);

        // 2. 사용자가 존재하지 않으면 빈 배열을 반환합니다.
        if (!user || !user.userId) {
            return [];
        }

        // 3. 얻은 userId를 사용하여 PostRepository를 통해 해당 사용자의 모든 게시물을 한 번의 쿼리로 효율적으로 조회합니다.
        return this.postRepo.getPostsByAuthor(user.userId);
    }
    async changePassword(userId: string, newPassword: string): Promise<boolean> {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        return this.userRepo.changePassword(userId, passwordHash);
    }
    async getAllUsers(): Promise<UserModel[]> {
        return this.userRepo.findAllUsers();
    }
    async isNicknameAvailable(nickname: string): Promise<boolean> {
        const user = await this.userRepo.findUserByNickname(nickname);
        return user === null;
    }
    async isEmailAvailable(email: string): Promise<boolean> {
        const user = await this.userRepo.findUserByEmail(email);
        return user === null;
    }
    async isPasswordValid(userId: string, password: string): Promise<boolean> {
        const user = await this.userRepo.findUserById(userId);
        if (!user) {
            return false;
        }
        return await bcrypt.compare(password, user.password);
    }
}