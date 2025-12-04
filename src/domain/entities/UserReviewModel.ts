import { ApplicationModel } from "./ApplicationModel";
import { UserModel } from "./UserModel";


// export interface ReviewModelProps {
//     reviewId: string;
//     rating: number;
//     comment?: string; // Optional
//     reviewType: ReviewTypeString;
//     createdAt?: Date; // Optional, can default
//     applicationId: string;
//     reviewerUserId: string;
//     reviewedUserId: string;
//     postId?: string; // Optional
// }

export class UserReviewModel {
    public reviewId: string | null;
    public rating: number;
    public comment: string | null;
    public createdAt: Date | null;
    public applicationId: number;
    public reviewerUserId: string;
    public reviewedUserId: string;
    public postId?: string;

    constructor(props: {
        reviewId: string,
        rating: number,
        comment: string,
        reviewerUserId: string,
        reviewedUserId?: string,
        createdAt?: Date,
        applicationId: number
        postId?: string
    }) {

        this, this.reviewId = props.reviewId;
        this.rating = props.rating;
        this.comment = props.comment;
        this.createdAt = props.createdAt;
        this.applicationId = props.applicationId;
        this.reviewerUserId = props.reviewerUserId;
        this.reviewedUserId = props.reviewedUserId;
        this.postId = props.postId
    }
}