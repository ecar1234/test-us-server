export class Messages{
    constructor(
        public id: number,
        public content: string,
        public senderId: number,
        public receiverId: number,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {}
}