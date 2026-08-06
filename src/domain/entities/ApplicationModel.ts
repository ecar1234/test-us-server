import { PostInfo } from "./interface/applicationPackage.js";

export class ApplicationModel {
    constructor(
        props: {
            id?: number,
            platform: string,
            mobileOs: string,
            status: string,
            appliedAt: Date,
            updatedAt: Date,
            postInfo: PostInfo,
            applicantId: string
        }
    ) {
        this.id = props.id;
        this.platform = props.platform;
        this.mobileOs = props.mobileOs;
        this.status = props.status;
        this.appliedAt = props.appliedAt;
        this.updatedAt = props.updatedAt;
        this.postInfo = props.postInfo;
        this.applicantId = props.applicantId;
     }

    readonly id: number | null;
    platform: string;
    mobileOs: string;
    status: string;
    readonly appliedAt: Date;
    updatedAt: Date | null = null;
    postInfo: PostInfo;
    applicantId: string;
}