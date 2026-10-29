
export class UserModel {
    public readonly userId: string | null;
    public email: string;
    public nickname: string;
    public password: string;
    public userType: string;
    public status: string | null = 'ACTIVE';
    public role: string;
    public userName: string | null;
    public birth: Date | null = null;
    public profileImg: object | null = null;
    public method: string;
    public readonly createdAt: Date | null = null;
    public updatedAt: Date | null = null;
    public posts: string[] = [];
    public applications: number[] = [];
    // public sentMessages: string[] = [];
    // public receiveMessages: string[] = [];
    constructor(
        props: {
            userId: string | null,
            email: string,
            nickname: string,
            password: string,
            userType: string,
            status: string,
            role: string,
            userName: string,
            birth?: Date,
            profileImg: object | null,
            method: string,
            createdAt?: Date | null,
            updatedAt?: Date | null,
            posts?: string[],
            applications?: number[],
            //  sentMessages: string[] = [],
            //  receiveMessages: string[] = [],
        }
    ) {
        this.userId = props.userId;
        this.email = props.email;
        this.nickname = props.nickname;
        this.password = props.password;
        this.userType = props.userType;
        this.status = props.status;
        this.role = props.role;
        this.userName = props.userName;
        this.birth = props.birth;
        this.profileImg = props.profileImg;
        this.method = props.method;
        this.createdAt = props.createdAt;
        this.updatedAt = props.createdAt;
        this.posts = props.posts;
        this.applications = props.applications;
     }
}

export class TResUserAndReivews {
    constructor(
        public user: UserModel,
        public averageRating: number,
        public reviewCount: number
    ) { }
}