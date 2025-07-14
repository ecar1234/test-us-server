import { AppDataSource } from "../../config/data_source";
import { User } from "../../domain/entities/user";
import { IUserRepository } from "../../domain/interface_repositories/IUserRepository";
import { UserEntity, UserType } from "../entities/user_entity";

export class UserRepository implements IUserRepository {
    async findUserById(userId: string): Promise<User | null> {
        const user = await AppDataSource.getRepository(UserEntity).findOne({
            where: { userId: userId }
        });
        if (!user) {
            return null;
        }
        // Convert UserEntity to User domain entity
        return new User(
            user.userId,
            user.email,
            user.password_hash,
            user.nickname,
            user.type,
            user.createAt,
            user.updateAt,
        );
    }
    public async findUserByEmail(email: string): Promise<User | null> {
        const user = await AppDataSource.getRepository(UserEntity).findOne({
            where: { email: email }
        });
        if (!user) {
            return null;
        }
        // Convert UserEntity to User domain entity
        return new User(
            user.userId,
            user.email,
            user.password_hash,
            user.nickname,
            user.type,
            user.createAt,
            user.updateAt,
        );  
    }
    async findAllUsers(): Promise<User[]> {
        return AppDataSource.getRepository(UserEntity).find().then(users => {
            return users.map(user => new User(
                user.userId,
                user.email,
                user.password_hash,
                user.nickname,
                user.type,
                user.createAt,
                user.updateAt,
            ));
        });
    }
    async findUserByNickname(nicname: string): Promise<User | null> {
        const user = await AppDataSource.getRepository(UserEntity).findOne({
            where: { nickname: nicname }
        });
        if (!user) {
            return null;
        }
        // Convert UserEntity to User domain entity
        return new User(
            user.userId,
            user.email,
            user.password_hash,
            user.nickname,
            user.type,
            user.createAt,
            user.updateAt,
        );
    }
    async updateUserInfo(changedUserInfo : User): Promise<User>{
        const userRepository = AppDataSource.getRepository(UserEntity);
        const user = await userRepository.findOneBy({ userId: changedUserInfo.userId });
        if (!user) {
            throw new Error("User not found");
        }
        
        user.email = changedUserInfo.email;
        user.nickname = changedUserInfo.nickName;
        user.type = changedUserInfo.userType == 'INDVIDUALS' ? UserType.INDVIDUALS : UserType.COMPANIES;;
        
        await userRepository.save(user);

        return new User(
            user.userId,
            user.email,
            user.password_hash,
            user.nickname,
            user.type,
            user.createAt,
            user.updateAt,
        );
    }
}