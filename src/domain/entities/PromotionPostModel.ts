

export class PromotionPostModel {
    public id: string | null;
    public author: { userId: string; nickname: string; } | string | null = null;
    public title: string;
    public subtitle: string;
    public platform: string;
    public mobileOs: string | null;
    public category: string;
    public contents: string;
    public status: string = 'active';
    public period: number = 7;
    public views: number = 0;
    public images: object[] = [];
    public domain: string;
    public postType: string = 'PromotionPostEntity';
    // public reviews: object[] = [];
    public createdAt: Date | null = new Date();
    public updatedAt: Date | null = null
    constructor(
        props: {
            id: string | null,
            author: { userId: string; nickname: string; } | string | null,
            title: string,
            subtitle: string,
            platform: string,
            mobileOs: string | null,
            category: string,
            contents: string,
            status: string,
            period: number,
            views?: number,
            images: object[],
            domain: string,
            postType?: string,
            //  reviews: object[] = [],
            createdAt?: Date | null ,
            updatedAt?: Date | null
        }
    ) { 
        this.id = props.id;
        this.author = props.author;
        this.title = props.title;
        this.subtitle = props.subtitle;
        this.platform = props.platform;
        this.mobileOs = props.mobileOs;
        this.category = props.category;
        this.contents = props.contents;
        this.status = props.status;
        this.period = props.period;
        this.views = props.views;
        this.images = props.images;
        this.domain = props.domain;
        this.postType = props.postType;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}