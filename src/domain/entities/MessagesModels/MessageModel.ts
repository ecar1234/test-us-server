import { RoomModel } from "./RoomModel";

export class MessageModel {
    constructor(
        props:
            {
                id: number | null,
                content: string,
                room: RoomModel,
                sender: {
                    userId: string;
                    nickname: string;
                    profileImg: { url: string; filename: string; originalname: string; mimetype: string; size: number; };
                },
                createdAt: Date
            }
    ) {
        this.id = props.id;
        this.content = props.content;
        this.room = props.room;
        this.sender = props.sender;
        this.createdAt = props.createdAt;
    }

    public id: number | null;
    public content: string;
    public room: RoomModel;
    public sender: {
        userId: string;
        nickname: string;
        profileImg: { url: string; filename: string; originalname: string; mimetype: string; size: number; };
    }
    public createdAt: Date;
}