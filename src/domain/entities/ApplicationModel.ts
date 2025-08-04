export class ApplicationModel {
    constructor(
        public readonly id: number | null,
        public platform: string,
        public status: string,
        public readonly appliedAt: Date | null = new Date(),
        public updatedAt: Date | null = null,
        public postId: string,
        public applicantId: string
    ) { }
}