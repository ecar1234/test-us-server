export interface IUserRepository {
    updateUserInfo(userId: string, userName: string, email: string, userType: string): Promise<any>;
    
}