
export class MessageModel {
    constructor(
        props:
            {
                id: number | null,
                content: string,
                roomId: number,
                sender: {
                    userId: string;
                    nickname: string;
                    profileImg: { url: string; filename: string; originalname: string; mimetype: string; size: number; };
                    status: string;
                },
                createdAt: Date
            }
    ) {
        this.id = props.id;
        this.content = props.content;
        this.roomId = props.roomId;
        this.sender = props.sender;
        this.createdAt = props.createdAt;
    }

    public id: number | null;
    public content: string;
    public roomId: number;
    public sender: {
        userId: string;
        nickname: string;
        profileImg: { url: string; filename: string; originalname: string; mimetype: string; size: number; };
        status: string;
    }
    public createdAt: Date;
}