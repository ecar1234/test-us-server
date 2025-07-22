import { AppDataSource } from "../../config/DataSource";
import { UserModel } from "../../domain/entities/UserModel";
import { IUserRepository } from "../../domain/interface_repositories/IUserRepository";
import { UserEntity, UserType } from "../entities/UserEntiry";

export class UserRepositoryImpl implements IUserRepository {

    private userRepository = AppDataSource.getRepository(UserEntity);
    private toDomainUser(userEntity: UserEntity): UserModel {
        return new UserModel(
            userEntity.userId,
            userEntity.email,
            userEntity.password_hash,
            userEntity.nickname,
            userEntity.type === UserType.INDVIDUALS ? 'INDVIDUALS' : 'COMPANIES',
            userEntity.createdAt,
            userEntity.updatedAt
        );
    }
    private toEntityUser(user: UserModel): UserEntity {
        const dbUser = this.userRepository.create({
            userId: user.userId,
            email: user.email,
            password_hash: user.password,
            nickname: user.nickName,
            type: user.userType === 'INDVIDUALS' ? UserType.INDVIDUALS : UserType.COMPANIES,
            createdAt: user.createdAt ? user.createdAt : new Date(),
            updatedAt: user.updatedAt ? user.updatedAt : new Date()
        });
        return dbUser;
    }

    async registerUser(user: UserModel): Promise<UserModel> {
       const dbUser = this.toEntityUser(user);
        const savedUser = await this.userRepository.save(dbUser);
        const resultUser = this.toDomainUser(savedUser);
        
        return resultUser;
    }
    deleteUser(userId: string): Promise<boolean> {
        return this.userRepository.delete({ userId }).then(result => result.affected !== 0);
    }
    updateUserInfo(user: UserModel): Promise<UserModel> {
        const dbUser = this.toEntityUser(user);
        return this.userRepository.save(dbUser).then(savedUser => this.toDomainUser(savedUser));
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