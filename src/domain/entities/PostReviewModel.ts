export class PostReviewModel {
    public reviewId: string | null;
    public rating: number;
    public comment: string | null;
    public reviewType: string;
    public createdAt: Date | null;
    public reviewerUserId: string;
    public postId?: string;

    constructor(props:{
        reviewId: string | null,
        rating: number,
        comment: string | null,
        reviewType: string,
        reviewerUserId: string,
        postId?: string,
        createdAt?: Date
    }) {
        this.reviewId = props.reviewId;
        this.rating = props.rating;
        this.comment = props.comment;
        this.reviewType = props.reviewType;
        this.createdAt = props.createdAt;
        this.reviewerUserId = props.reviewerUserId;
        this.postId = props.postId;
    }
}