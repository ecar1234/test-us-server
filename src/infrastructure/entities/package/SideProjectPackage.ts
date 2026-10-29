import { ApplicationModel } from "../../../domain/entities/ApplicationModel.js";
import { UserModel } from "../../../domain/entities/UserModel.js";


export interface TResSideProjectApplications{
    user: UserModel,
    application: ApplicationModel
}