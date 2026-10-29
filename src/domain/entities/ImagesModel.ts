
export class ImagesModel {
    public readonly id: number | null;
    public filename: string;
    public originalname: string;
    public mimetype: string;
    public size: number;
    public url: string;
    public postId: string;
    public postType?: string;
    public createdAt: Date | null = new Date();
    public updatedAt: Date | null = null;

    constructor(
        props: {
            readonly id: number | null,
            filename: string,
            originalname: string,
            mimetype: string,
            size: number,
            url: string,
            postId: string,
            postType?: string,
            createdAt?: Date ,
            updatedAt?: Date
        }
    ) {
        this.id = props.id;
        this.filename = props.filename;
        this.originalname = props.originalname;
        this.mimetype = props.mimetype;
        this.size = props.size;
        this.url = props.url;
        this.postId = props.url;
        this.postType = props.postType;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
     }

    

}