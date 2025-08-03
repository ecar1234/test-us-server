import { AppDataSource } from "../../config/DataSource";
import { UserModel } from "../../domain/entities/UserModel";
import { IUserRepository } from "../../domain/interface_repositories/IUserRepository";
import { UserEntity, UserStatus, UserType } from "../entities/UserEntity";

export class UserRepositoryImpl implements IUserRepository {

    private userRepository = AppDataSource.getRepository(UserEntity);
    private toDomainUser(userEntity: UserEntity): UserModel {
        return new UserModel(
            userEntity.userId,
            userEntity.email,
            userEntity.nickname,
            userEntity.password_hash,
            userEntity.type === UserType.INDVIDUALS ? 'INDVIDUALS' : 'COMPANIES',
            userEntity.status === UserStatus.ACTIVE ? 'ACTIVE' : 'INACTIVE',
            userEntity.userName,
            userEntity.birth,
            userEntity.createdAt,
            userEntity.updatedAt
        );
    }
    private toEntityUser(user: UserModel): UserEntity {
        const dbUser:UserEntity = this.userRepository.create({
            ...(user.userId && { userId: user.userId }), // user.userId가 있을 때만 객체에 포함
            email: user.email,
            password_hash: user.password,
            nickname: user.nickname,
            type: user.userType === 'INDVIDUALS' ? UserType.INDVIDUALS : UserType.COMPANIES,
            status: user.status === 'ACTIVE' ? UserStatus.ACTIVE : UserStatus.INACTIVE,
            userName: user.userName,
            birth: user.birth
        });
        return dbUser;
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
        // return this.userRepository.delete({ userId }).then(result => result.affected !== 0);
    }
    async updateUserInfo(user: UserModel): Promise<UserModel> {
        // console.log("Impl : ", user);
        const userEntity = await this.userRepository.findOne({ where: {userId : user.userId} });
        if (!userEntity) {
            throw new Error("User not found");
        }

        // DB에서 조회한 엔티티의 속성을 직접 수정합니다.
        userEntity.nickname = user.nickname;
        userEntity.type = user.userType === 'INDVIDUALS' ? UserType.INDVIDUALS : UserType.COMPANIES;
        userEntity.userName = user.userName;
        userEntity.birth = user.birth;

        // 수정된 엔티티를 저장합니다.

        const savedUser = await this.userRepository.save(userEntity);
        return this.toDomainUser(savedUser);
    }
    findUserById(userId: string): Promise<UserModel | null> {
        return this.userRepository.findOne({ where: { userId } })
            .then(userEntity => userEntity ? this.toDomainUser(userEntity) : null);
    }
    findUserByEmail(email: string): Promise<UserModel | null> {
        return this.userRepository.findOne({ where: { email } })
            .then(userEntity => userEntity ? this.toDomainUser(userEntity) : null);
    }
    findUserByNickname(nickname: string): Promise<UserModel | null> {
        return this.userRepository.findOne({ where: { nickname } })
            .then(userEntity => userEntity ? this.toDomainUser(userEntity) : null);
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