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
exports.AutoGen1754220188925 = void 0;
class AutoGen1754220188925 {
    constructor() {
        this.name = 'AutoGen1754220188925';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`Post\` ADD \`platform\` text NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`birth\``);
            yield queryRunner.query(`ALTER TABLE \`User\` ADD \`birth\` datetime NULL`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`birth\``);
            yield queryRunner.query(`ALTER TABLE \`User\` ADD \`birth\` date NULL`);
            yield queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`platform\``);
        });
    }
}
exports.AutoGen1754220188925 = AutoGen1754220188925;
