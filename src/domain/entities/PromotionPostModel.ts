

export class PromotionPostModel {
    constructor(
        public id: string | null,
        public author: { userId: string; nickname: string; } | string | null = null,
        public title: string,
        public subtitle: string,
        public platform: string,
        public mobileOs: string|null,
        public category: string,
        public contents: string,
        public status: string = 'active',
        public period: number = 7,
        public views: number = 0,
        public images: object[] = [],
        public domain: string,
        public postType: string = 'PromotionPostEntity',
        public reviews: object[] = [],
        public createdAt: Date | null = new Date(),
        public updatedAt: Date | null = null
    ){}
}