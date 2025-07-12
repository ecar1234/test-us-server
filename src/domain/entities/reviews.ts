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

    // 리뷰 정보를 반환하는 메서드
    getReviewInfo() {
        return {
            id: this.id,
            postId: this.postId,
            userId: this.userId,
            content: this.content,
            rating: this.rating,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // 리뷰 내용을 수정하는 메서드
    updateContent(newContent: string) {
        this.content = newContent;
        this.updatedAt = new Date();
    }
}