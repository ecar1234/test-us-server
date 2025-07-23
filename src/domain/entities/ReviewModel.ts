export class ReviewModel{
    constructor(
        public readonly reviewId: string,
        public rating: number,
        public comment: string | null,
        public reviewType: 'PRODUCT_RATING' | 'PARTICIPANT_ATTITUDE_RATING',
        public readonly createdAt: Date,
        public readonly applicationId: string,
        public readonly reviewerUserId: string,
        public readonly reviewedUserId: string
    ) {}
}