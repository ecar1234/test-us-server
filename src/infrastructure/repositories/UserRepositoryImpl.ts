import { AppDataSource } from "../../config/DataSource.js";
import { UserModel } from "../../domain/entities/UserModel.js";
import { IUserRepository } from "../../domain/interface_repositories/IUserRepository.js";
import { UserEntity, UserMethod, UserRole, UserStatus, UserType } from "../entities/UserEntity.js";
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
            userEntity.type === UserType.INDIVIDUALS ? 'INDIVIDUALS' : (userEntity.type === UserType.COMPANIES ? 'COMPANIES' : 'NORMAL'),
            userEntity.status === UserStatus.ACTIVE ? 'ACTIVE' : 'INACTIVE',
            this.getUserRoleString(userEntity.role),
            userEntity.userName,
            userEntity.birth,
            userEntity.image,
            userEntity.method,
            userEntity.createdAt,
            userEntity.updatedAt,
            userEntity.posts ? userEntity.posts.map(post => post.postId) : [],
            userEntity.applications ? userEntity.applications.map(
                applicationEntity => applicationEntity.appId) : [],
        );
    }
    private toEntityUser(user: UserModel): UserEntity {
        const dbUser: UserEntity = this.userRepository.create({
            ...(user.userId && { userId: user.userId }), // user.userId가 있을 때만 객체에 포함
            email: user.email,
            password_hash: user.password,
            nickname: user.nickname,
            type: user.userType === 'INDIVIDUALS' ? UserType.INDIVIDUALS : (user.userType === 'COMPANIES' ? UserType.COMPANIES : UserType.NORMAL),
            status: user.status === 'ACTIVE' ? UserStatus.ACTIVE : UserStatus.INACTIVE,
            role: this.getUserRole(user.role),
            userName: user.userName,
            birth: user.birth,
            ...(user.posts && { posts: user.posts.map(post => ({ postId: post })) }),
            ...(user.applications && { applications: user.applications.map(applicationId => ({ appId: applicationId })) }),
            ...(user.profileImg && { image: user.profileImg as { url: string; filename: string; originalname: string; mimetype: string; size: number } }),
            method: user.method === 'EMAIL' ? UserMethod.EMAIL : (user.method === 'GOOGLE' ? UserMethod.GOOGLE : UserMethod.NAVER),
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
            case 'USER':
                return UserRole.USER;

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
            case UserRole.USER:
                return 'USER';

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
        
        const findUser = await this.userRepository.findOne({ where: { userId: user.userId } });
        if (!findUser) {
            throw new Error("User not found");
        }
        const userEntity = this.toEntityUser(user);

        findUser.nickname = userEntity.nickname;
        findUser.type = userEntity.type,
        findUser.role = userEntity.role;
        findUser.userName = userEntity.userName;
        findUser.birth = userEntity.birth;
        findUser.method = userEntity.method;
        findUser.image = userEntity.image;

        const savedUser = await this.userRepository.save(findUser);
        return this.toDomainUser(savedUser);
    }
    findUserById(userId: string): Promise<UserModel | null> {
        return this.userRepository.findOne({ where: {userId: userId, status: UserStatus.ACTIVE} })
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
    async findUserByEmail(email: string): Promise<UserModel | null> {
        const user = await this.userRepository.findOne(
            { where: { email: email } });
        if (!user) {
            return null;
        }
        return this.toDomainUser(user);
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
    async updatePassword(userId: string, newPassword: string): Promise<boolean> {
        return this.userRepository.update({ userId }, { password_hash: newPassword })
            .then(result => result.affected !== 0);
    }
    findAllUsers(): Promise<UserModel[]> {
        return this.userRepository.find()
            .then(userEntities => userEntities.map(userEntity => this.toDomainUser(userEntity)));
    }

}