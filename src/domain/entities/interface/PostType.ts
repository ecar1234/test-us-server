
export interface UploadedImageInfo {
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    url: string;
}

export interface ImageToDelete {
    filename: string;
    url: string;
}