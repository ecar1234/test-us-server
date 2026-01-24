import { UserModel } from "../UserModel";
import { RoomModel } from "./RoomModel";


export class RoomMemberModel {
    constructor(
        props:
            {
                id: number,
                room: RoomModel,
                user: UserModel,
                userId: string,
                unreadCount: number,
                lastReadMessageId: number,
                isActive: boolean,
                joinedAt: Date,
            }
    ) {
        this.id = props.id;
        this.room = props.room;
        this.user = props.user;
        this.userId = props.userId;
        this.unreadCount = props.unreadCount;
        this.lastReadMessageId = props.lastReadMessageId;
        this.isActive = props.isActive;
        this.joinedAt = props.joinedAt;
    }

    public id: number;
    public room: RoomModel;
    public user: UserModel;
    public userId: string;
    public unreadCount: number;
    public lastReadMessageId: number;
    public isActive: boolean;
    public joinedAt: Date;

}