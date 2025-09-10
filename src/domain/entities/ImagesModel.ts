
export class ImagesModel{
    constructor(
        public readonly id: number | null,
        public filename: string,
        public originalname: string,
        public mimetype: string,
        public size: string,
        public url: string,
        public createdAt: Date | null = new Date(),
        public updatedAt: Date | null = null
    ){}
}