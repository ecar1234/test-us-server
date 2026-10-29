import { ChildEntity } from "typeorm";
import { BasePostEntity } from "./BasePostEntity.js";


@ChildEntity('CHAT')
export class CoffeeChatPostEntity extends BasePostEntity {
    
}