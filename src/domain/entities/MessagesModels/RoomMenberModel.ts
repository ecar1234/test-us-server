import { UserModel } from "../UserModel.js";

export class RoomMemberModel {
    constructor(
        props:
            {
                id: number,
                roomId: number,
                user: UserModel,
                userId: string,
                unreadCount: number,
                lastReadMessageId: number,
                isActive: boolean,
                joinedAt: Date,
            }
    ) {
        this.id = props.id;
        this.roomId = props.roomId;
        this.user = props.user;
        this.userId = props.userId;
        this.unreadCount = props.unreadCount;
        this.lastReadMessageId = props.lastReadMessageId;
        this.isActive = props.isActive;
        this.joinedAt = props.joinedAt;
    }

    public id: number;
    public roomId: number;
    public user: UserModel;
    public userId: string;
    public unreadCount: number;
    public lastReadMessageId: number;
    public isActive: boolean;
    public joinedAt: Date;
}