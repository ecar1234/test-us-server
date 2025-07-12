export class Post {
    constructor(
        public id: number,
        public title: string,
        public content: string,
        public authorId: number,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {}

    // 게시글 정보를 반환하는 메서드
    getPostInfo() {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            authorId: this.authorId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // 게시글 내용을 수정하는 메서드
    updateContent(newContent: string) {
        this.content = newContent;
        this.updatedAt = new Date();
    }
}