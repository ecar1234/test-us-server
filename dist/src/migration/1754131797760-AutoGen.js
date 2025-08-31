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
exports.AutoGen1754131797760 = void 0;
class AutoGen1754131797760 {
    constructor() {
        this.name = 'AutoGen1754131797760';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`User\` ADD \`birth\` date NULL`);
            yield queryRunner.query(`ALTER TABLE \`User\` CHANGE \`userName\` \`userName\` varchar(20) NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`User\` CHANGE \`userName\` \`userName\` varchar(20) NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`birth\``);
        });
    }
}
exports.AutoGen1754131797760 = AutoGen1754131797760;
