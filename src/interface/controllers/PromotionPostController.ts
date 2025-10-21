
import { Response, Request } from "express";
import { PromotionPostUseCase } from "../../app/PromotionPostUseCase";

export class PromotionPostController {
    constructor(private useCase: PromotionPostUseCase) { }

}