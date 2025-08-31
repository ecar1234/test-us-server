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
exports.AutoGen1752569175705 = void 0;
class AutoGen1752569175705 {
    constructor() {
        this.name = 'AutoGen1752569175705';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`Post\` DROP FOREIGN KEY \`FK_8b688f2d8d7161ed1be09d452e3\``);
            yield queryRunner.query(`ALTER TABLE \`Messages\` CHANGE \`createAt\` \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
            yield queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`createAt\``);
            yield queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`updateAt\``);
            yield queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`author_user_id\``);
            yield queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`createAt\``);
            yield queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`updateAt\``);
            yield queryRunner.query(`ALTER TABLE \`Post\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
            yield queryRunner.query(`ALTER TABLE \`Post\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
            yield queryRunner.query(`ALTER TABLE \`Post\` ADD \`authorId\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`User\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
            yield queryRunner.query(`ALTER TABLE \`User\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
            yield queryRunner.query(`ALTER TABLE \`Post\` ADD CONSTRAINT \`FK_cef8d6e8edb69c82e5f10bb4026\` FOREIGN KEY (\`authorId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`Post\` DROP FOREIGN KEY \`FK_cef8d6e8edb69c82e5f10bb4026\``);
            yield queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`updatedAt\``);
            yield queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`createdAt\``);
            yield queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`authorId\``);
            yield queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`updatedAt\``);
            yield queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`createdAt\``);
            yield queryRunner.query(`ALTER TABLE \`User\` ADD \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
            yield queryRunner.query(`ALTER TABLE \`User\` ADD \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
            yield queryRunner.query(`ALTER TABLE \`Post\` ADD \`author_user_id\` varchar(36) NULL`);
            yield queryRunner.query(`ALTER TABLE \`Post\` ADD \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
            yield queryRunner.query(`ALTER TABLE \`Post\` ADD \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
            yield queryRunner.query(`ALTER TABLE \`Messages\` CHANGE \`createdAt\` \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
            yield queryRunner.query(`ALTER TABLE \`Post\` ADD CONSTRAINT \`FK_8b688f2d8d7161ed1be09d452e3\` FOREIGN KEY (\`author_user_id\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
}
exports.AutoGen1752569175705 = AutoGen1752569175705;
