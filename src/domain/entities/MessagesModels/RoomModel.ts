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
                lastMessage: MessageModel,
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
        this.lastMessage = props.lastMessage;
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
    public lastMessage: MessageModel;
    public lastMessageContent: string;
    public lastMessageAt: Date;
    public members: RoomMemberModel[];
    public messages: MessageModel[];
    public createdAt: Date;
}