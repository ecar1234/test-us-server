export class Application {
    constructor(
        public readonly id: string | null,
        public platform: string,
        public status: string,
        public readonly appliedAt: Date | null = new Date(),
        public updatedAt: Date | null = null,
        public readonly postId: string,
        public readonly applicantId: string
    ) { }
}