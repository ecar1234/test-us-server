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
exports.AutoGen1754121006403 = void 0;
class AutoGen1754121006403 {
    constructor() {
        this.name = 'AutoGen1754121006403';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`Messages\` ADD \`deleteSender\` tinyint NOT NULL DEFAULT 0`);
            yield queryRunner.query(`ALTER TABLE \`Messages\` ADD \`deleteReceiver\` tinyint NOT NULL DEFAULT 0`);
            yield queryRunner.query(`ALTER TABLE \`Messages\` ADD UNIQUE INDEX \`IDX_cdff51074d5feaa3b9849cb827\` (\`messageId\`)`);
            yield queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_3e901cbb9f32cffeb31425e1b87\``);
            yield queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_a8bad6d5267a5c873dd1b026454\``);
            yield queryRunner.query(`ALTER TABLE \`Application\` DROP FOREIGN KEY \`FK_6b9bce3de357b4161cbcd844ca6\``);
            yield queryRunner.query(`ALTER TABLE \`Post\` DROP FOREIGN KEY \`FK_cef8d6e8edb69c82e5f10bb4026\``);
            yield queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_0d07ae311ec0554a3f9ad8011a2\``);
            yield queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_778a3ad424798e5bbdca6f1f484\``);
            yield queryRunner.query(`ALTER TABLE \`User\` DROP PRIMARY KEY`);
            yield queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`userId\``);
            yield queryRunner.query(`ALTER TABLE \`User\` ADD \`userId\` varchar(36) NOT NULL PRIMARY KEY`);
            yield queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_3e901cbb9f32cffeb31425e1b87\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_a8bad6d5267a5c873dd1b026454\` FOREIGN KEY (\`reviewedUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Application\` ADD CONSTRAINT \`FK_6b9bce3de357b4161cbcd844ca6\` FOREIGN KEY (\`appUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Post\` ADD CONSTRAINT \`FK_cef8d6e8edb69c82e5f10bb4026\` FOREIGN KEY (\`authorId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_0d07ae311ec0554a3f9ad8011a2\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_778a3ad424798e5bbdca6f1f484\` FOREIGN KEY (\`receiverUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_778a3ad424798e5bbdca6f1f484\``);
            yield queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_0d07ae311ec0554a3f9ad8011a2\``);
            yield queryRunner.query(`ALTER TABLE \`Post\` DROP FOREIGN KEY \`FK_cef8d6e8edb69c82e5f10bb4026\``);
            yield queryRunner.query(`ALTER TABLE \`Application\` DROP FOREIGN KEY \`FK_6b9bce3de357b4161cbcd844ca6\``);
            yield queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_a8bad6d5267a5c873dd1b026454\``);
            yield queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_3e901cbb9f32cffeb31425e1b87\``);
            yield queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`userId\``);
            yield queryRunner.query(`ALTER TABLE \`User\` ADD \`userId\` varchar(255) NOT NULL`);
            yield queryRunner.query(`ALTER TABLE \`User\` ADD PRIMARY KEY (\`userId\`)`);
            yield queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_778a3ad424798e5bbdca6f1f484\` FOREIGN KEY (\`receiverUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_0d07ae311ec0554a3f9ad8011a2\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Post\` ADD CONSTRAINT \`FK_cef8d6e8edb69c82e5f10bb4026\` FOREIGN KEY (\`authorId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Application\` ADD CONSTRAINT \`FK_6b9bce3de357b4161cbcd844ca6\` FOREIGN KEY (\`appUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_a8bad6d5267a5c873dd1b026454\` FOREIGN KEY (\`reviewedUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_3e901cbb9f32cffeb31425e1b87\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
            yield queryRunner.query(`ALTER TABLE \`Messages\` DROP INDEX \`IDX_cdff51074d5feaa3b9849cb827\``);
            yield queryRunner.query(`ALTER TABLE \`Messages\` DROP COLUMN \`deleteReceiver\``);
            yield queryRunner.query(`ALTER TABLE \`Messages\` DROP COLUMN \`deleteSender\``);
        });
    }
}
exports.AutoGen1754121006403 = AutoGen1754121006403;
