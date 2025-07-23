export class MessageModel{
    constructor(
        public readonly id: string | null,
        public content: string,
        public readonly createdAt: Date = new Date(),
        public readAt: Date | null,
        public deleteSender: boolean | null,
        public deleteReceiver: boolean = false,
        public senderId: string,
        public receiverId: string
    ) {}
}