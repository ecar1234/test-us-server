interface IAuthRepository {
    signup(user_name: string, email: string, password: string): Promise<any>;

    signin(email: string, password: string): Promise<any>;

    withdraw(email: string) : Promise<any>;
}

export default IAuthRepository;