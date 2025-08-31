"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoGen1754787931497 = void 0;
class AutoGen1754787931497 {
    constructor() {
        this.name = 'AutoGen1754787931497';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`User\` CHANGE \`type\` \`type\` enum ('INDIVIDUALS', 'COMPANIES') NOT NULL DEFAULT 'INDIVIDUALS'`);
            yield queryRunner.query(`ALTER TABLE \`User\` CHANGE \`role\` \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'ANALYST', 'OPERATER', 'PM', 'QA', 'CS') NOT NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`User\` CHANGE \`role\` \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'PM', 'QA', 'CS') NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`User\` CHANGE \`type\` \`type\` enum ('INDVIDUALS', 'COMPANIES') NOT NULL DEFAULT 'INDVIDUALS'`);
        });
    }
}
exports.AutoGen1754787931497 = AutoGen1754787931497;
