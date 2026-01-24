import { RoomType } from "../../../infrastructure/entities/MessagesEntities/RoomEntity";
import { MessageModel } from "./MessageModel";
import { RoomMemberModel } from "./RoomMenberModel";

export class RoomModel {
    constructor(
        props:
            {
                id: number,
                type: RoomType,
                post: {
                    postId: string;
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
        postId: string;
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