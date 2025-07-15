export class Reviews{
    constructor(
        public id: number,
        public postId: number,
        public userId: number,
        public content: string,
        public rating: number,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {}
}