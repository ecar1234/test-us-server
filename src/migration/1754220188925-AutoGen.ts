import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1754220188925 implements MigrationInterface {
    name = 'AutoGen1754220188925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post\` ADD \`platform\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`birth\``);
        await queryRunner.query(`ALTER TABLE \`User\` ADD \`birth\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`birth\``);
        await queryRunner.query(`ALTER TABLE \`User\` ADD \`birth\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`platform\``);
    }

}
