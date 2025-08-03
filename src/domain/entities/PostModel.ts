export class PostModel {
    constructor(
        public id: string | null,
        public authorId: string | null = null,
        public title: string,
        public subtitle: string,
        public platform: string[],
        public contents: string,
        public status: string = 'active',
        public period: number = 7,
        public createdAt: Date | null = new Date(),
        public updatedAt: Date | null = null,
        public appilcations: string[] = []
    ) {}
}