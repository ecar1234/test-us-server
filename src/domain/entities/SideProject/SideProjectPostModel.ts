import { ApplicationModel } from "../ApplicationModel.js";
import { ProjectRoleModel } from "./ProjectRoleModel.js";


export class SideProjectPostModel {
    public id: string;
    public author: { userId: string, nickname: string} | string | null = null;
    public postType: string | null = 'SIDE_PROJECT';
    public title: string;
    public contents: string;
    public platform: string;
    public mobileOs: string
    public category: string;
    public views: number;
    public status: string;
    public period: number;
    
    //side project only
    public sprintDurations: string;
    public referenceLink: string[];
    public projectRoles: ProjectRoleModel[];
    // public applications: number[] | null = [];
    public expiredAt: Date | null = new Date();
    public createdAt: Date | null;
    public updatedAt: Date | null;
    public applicants: ApplicationModel[] | number[] | null = []
    constructor(
        props: {
            id: string,
            author: { userId: string, nickname: string} | string | null,
            postType?: string,
            title: string,
            contents: string,
            platform: string,
            mobileOs: string,
            category: string,
            views: number,
            status: string,
            period: number,
            sprintDurations: string,
            referenceLink: string[],
            projectRoles: ProjectRoleModel[],
            // applications?: number[],
            expiredAt?: Date | null,
            createdAt?: Date | null,
            updatedAt?: Date | null
            applicants?: ApplicationModel[] | number[]
        }
    ) { 
        this.id = props.id;
        this.author = props.author;
        this.postType = props.postType;
        this.title = props.title;
        this.contents = props.contents;
        this.platform = props.platform;
        this.mobileOs = props.mobileOs;
        this.category = props.category;
        this.views = props.views;
        this.status = props.status;
        this.period = props.period
        this.sprintDurations = props.sprintDurations;
        this.referenceLink = props.referenceLink;
        this.projectRoles = props.projectRoles;
        // this.applications = props.applications;
        this.expiredAt = props.expiredAt;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.applicants = props.applicants;
    }
}