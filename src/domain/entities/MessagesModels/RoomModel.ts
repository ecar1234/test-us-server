import { RoomType } from "../../../infrastructure/entities/MessagesEntities/RoomEntity.js";
import { MessageModel } from "./MessageModel.js";
import { RoomMemberModel } from "./RoomMenberModel.js";

export class RoomModel {
    constructor(
        props:
            {
                id: number,
                type: RoomType,
                post: {
                    id: string;
                    images: { url: string; filename: string; originalname: string; mimetype: string; size: number; }[],
                    title: string;
                },
                targetUserId: string,
                lastMessageId: number | null,
                lastMessageContent: string,
                lastMessageAt: Date,
                members: RoomMemberModel[],
                messages: MessageModel[],
                createdAt: Date
            }
    ) {
        this.id = props.id;
        this.type = props.type;
        this.post = props.post;
        this.targetUserId = props.targetUserId;
        this.lastMessageId = props.lastMessageId;
        this.lastMessageContent = props.lastMessageContent;
        this.lastMessageAt = props.lastMessageAt;
        this.members = props.members;
        this.messages = props.messages;
        this.createdAt = props.createdAt;
    }

    public id: number;
    public type: RoomType;
    public post: {
        id: string;
        images: { url: string; filename: string; originalname: string; mimetype: string; size: number; }[],
        title: string;
    }
    public targetUserId: string;
    public lastMessageId: number | null;
    public lastMessageContent: string;
    public lastMessageAt: Date;
    public members: RoomMemberModel[];
    public messages: MessageModel[];
    public createdAt: Date;
}