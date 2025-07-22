export class PostModel {
    constructor(
        public id: string | null,
        public authorId: string | null = null,
        public title: string,
        public subtitle: string,
        public content: string,
        public status: string = 'active',
        public period: number = 7,
        public createdAt: Date | null = new Date(),
        public updatedAt: Date | null = null
    ) {}
}