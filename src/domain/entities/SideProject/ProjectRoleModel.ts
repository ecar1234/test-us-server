

export class ProjectRoleModel {
    id: number;
    roleName: string;
    requiredCount: number;
    currentCount: number;
    isClosed: boolean;

    constructor(
        props: {
            id: number,
            roleName: string,
            requiredCount: number,
            currentCount: number,
            isClosed: boolean
        }
    ){
        this.id = props.id;
        this.roleName = props.roleName;
        this.requiredCount = props.requiredCount;
        this.currentCount = props.currentCount;
        this.isClosed = props.isClosed;
    }
}