import { User } from "../entities/user";

interface IAuthRepository {
    signup(user_name: string, email: string, password: string): Promise<User>;

    withdraw(email: string) : Promise<boolean>;
}

export default IAuthRepository;