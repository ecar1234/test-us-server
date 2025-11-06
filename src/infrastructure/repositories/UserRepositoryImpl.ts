import { AppDataSource } from "../../config/DataSource";
import { ApplicationModel } from "../../domain/entities/ApplicationModel";
import { UserModel } from "../../domain/entities/UserModel";
import { IUserRepository } from "../../domain/interface_repositories/IUserRepository";
import { UserEntity, UserRole, UserStatus, UserType } from "../entities/UserEntity";
import { In } from "typeorm";


export class UserRepositoryImpl implements IUserRepository {
    private userRepository = AppDataSource.getRepository(UserEntity);
    
    private toDomainUser(userEntity: UserEntity): UserModel {
        // console.log(userEntity);
        return new UserModel(
            userEntity.userId,
            userEntity.email,
            userEntity.nickname,
            userEntity.password_hash,
            userEntity.type === UserType.INDIVIDUALS ? 'INDIVIDUALS' : 'COMPANIES',
            userEntity.status === UserStatus.ACTIVE ? 'ACTIVE' : 'INACTIVE',
            this.getUserRoleString(userEntity.role),
            userEntity.userName,
            userEntity.birth,
            userEntity.image,
            userEntity.createdAt,
            userEntity.updatedAt,
            userEntity.posts ? userEntity.posts.map(post => post.postId) : [],
            userEntity.applications ? userEntity.applications.map(
                applicationEntity => new ApplicationModel(applicationEntity.appId, applicationEntity.platform, applicationEntity.status, applicationEntity.appliedAt, applicationEntity.updatedAt, applicationEntity.post.postId, applicationEntity.applicant.userId)) : [],
            // userEntity.sentMessages && userEntity.sentMessages.map(message => message.messageId),
            // userEntity.receiveMessages && userEntity.receiveMessages.map(message => message.messageId),
            // userEntity.givenReviews && userEntity.givenReviews.map(review => review.reviewId),
            // userEntity.receivedReviews && userEntity.receivedReviews.map(review => review.reviewId)
        );
    }
    private toEntityUser(user: UserModel): UserEntity {
        const dbUser: UserEntity = this.userRepository.create({
            ...(user.userId && { userId: user.userId }), // user.userId가 있을 때만 객체에 포함
            email: user.email,
            password_hash: user.password,
            nickname: user.nickname,
            type: user.userType === 'INDIVIDUALS' ? UserType.INDIVIDUALS : UserType.COMPANIES,
            status: user.status === 'ACTIVE' ? UserStatus.ACTIVE : UserStatus.INACTIVE,
            role: this.getUserRole(user.role),
            userName: user.userName,
            birth: user.birth,
            ...(user.posts && { posts: user.posts.map(post => ({ postId: post })) }),
            ...(user.applications && { applications: user.applications.map(application => ({ appId: application.id })) }),
            ...(user.profileImg && { image: user.profileImg as { url: string; filename: string; originalname: string; mimetype: string; size: number } }),
            // ...(user.sentMessages && { sentMessages: user.sentMessages.map(message => ({ messageId: message.id })) }),
            // ...(user.receiveMessages && { receiveMessages: user.receiveMessages.map(message => ({ messageId: message.id })) }),
            // ...(user.givenReviews && { givenReviews: user.givenReviews.map(review => ({ reviewId: review.id })) }),
            // ...(user.receivedReviews && { receivedReviews: user.receivedReviews.map(review => ({ reviewId: review.id })) }  )
        });
        return dbUser;
    }
    private getUserRole(role: string): UserRole {
        switch (role) {
            case 'PROGRAMMER':
                return UserRole.PROGRAMMER;
            case 'DESIGNER':
                return UserRole.DESIGNER;
            case 'PUBLISHER':
                return UserRole.PUBLISHER;
            case 'PLANNER':
                return UserRole.PLANNER;
            case 'MANAGER':
                return UserRole.MANAGER;
            case 'MARKETER':
                return UserRole.MARKETER;
            case 'ANALYST':
                return UserRole.ANALYST;
            case 'OPERATER':
                return UserRole.OPERATER;
            case 'PM':
                return UserRole.PM;
            case 'QA':
                return UserRole.QA;
            case 'CS':
                return UserRole.CS;
            default:
                throw new Error('Invalid role');
        }
    }
    private getUserRoleString(role: UserRole): string {
        switch (role) {
            case UserRole.PROGRAMMER:
                return 'PROGRAMMER';
            case UserRole.DESIGNER:
                return 'DESIGNER';
            case UserRole.PUBLISHER:
                return 'PUBLISHER';
            case UserRole.PLANNER:
                return 'PLANNER';
            case UserRole.MANAGER:
                return 'MANAGER';
            case UserRole.MARKETER:
                return 'MARKETER';
            case 'ANALYST':
                return 'ANALYST';
            case UserRole.OPERATER:
                return 'OPERATER'
            case UserRole.PM:
                return 'PM';
            case UserRole.QA:
                return 'QA';
            case UserRole.CS:
                return 'CS';
            default:
                throw new Error('Invalid role');
        }
    }


    async registerUser(user: UserModel): Promise<UserModel> {
        const dbUser = this.toEntityUser(user);
        const savedUser = await this.userRepository.save(dbUser);
        const resultUser = this.toDomainUser(savedUser);

        return resultUser;
    }
    async deleteUser(userId: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { userId: userId } });
        if (!user) {
            throw new Error("User not found");
        }
        user.status = UserStatus.INACTIVE;
        await this.userRepository.save(user);
        return true;
    }
    async updateUserInfo(user: UserModel): Promise<UserModel> {
        const newUserEntity  = this.toEntityUser(user);

        const findUser = await this.userRepository.findOne({ where: { userId: newUserEntity.userId } });
        if (!findUser) {
            throw new Error("User not found");
        }

        // DB에서 조회한 엔티티의 속성을 직접 수정합니다.
        findUser.nickname = newUserEntity.nickname;
        findUser.type = newUserEntity.type,
        findUser.role = newUserEntity.role;
        findUser.userName = newUserEntity.userName;
        findUser.birth = newUserEntity.birth;
        if(newUserEntity.image){
            findUser.image = newUserEntity.image;
        }

        // 수정된 엔티티를 저장합니다.

        const savedUser = await this.userRepository.save(findUser);
        return this.toDomainUser(savedUser);
    }
    findUserById(userId: string): Promise<UserModel | null> {
        return this.userRepository.findOne({ where: { userId } })
            .then(userEntity => userEntity ? this.toDomainUser(userEntity) : null);
    }
    async findUsersByIds(ids: string[]): Promise<UserModel[]> {
        const users = await this.userRepository.find({
            where: { userId: In(ids) }, relations: ['applications', 'applications.post', 'applications.applicant', 'applications.reviews']
        });
        if (!users) {
            return [];
        }
        // console.log(users[0].applications[0]);
        return users.map((user) => this.toDomainUser(user));
    }
    findUserByEmail(email: string): Promise<UserModel | null> {
        return this.userRepository.findOne({ where: { email } })
            .then(userEntity => userEntity ? this.toDomainUser(userEntity) : null);
    }
    findUserByNickname(nickname: string): Promise<UserModel | null> {
        return this.userRepository.findOne({ where: { nickname } })
            .then(userEntity => userEntity ? this.toDomainUser(userEntity) : null);
    }
    async findPostsByNickname(nickname: string): Promise<UserModel> {
        const user = await this.userRepository.findOne({
            where: { nickname: nickname },
            relations: ['posts']
        });
        if (!user) {
            throw new Error("User not found");
        }
        return this.toDomainUser(user);
    }
    changePassword(userId: string, newPassword: string): Promise<boolean> {
        return this.userRepository.update({ userId }, { password_hash: newPassword })
            .then(result => result.affected !== 0);
    }
    findAllUsers(): Promise<UserModel[]> {
        return this.userRepository.find()
            .then(userEntities => userEntities.map(userEntity => this.toDomainUser(userEntity)));
    }

}