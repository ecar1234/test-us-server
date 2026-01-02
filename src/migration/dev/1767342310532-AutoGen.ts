import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1767342310532 implements MigrationInterface {
    name = 'AutoGen1767342310532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`mobileOs\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` CHANGE \`platform\` \`platform\` varchar(10) NOT NULL DEFAULT 'mobile'`);
        await queryRunner.query(`ALTER TABLE \`applications\` CHANGE \`platform\` \`platform\` enum ('web', 'mobile') NOT NULL DEFAULT 'web'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`applications\` CHANGE \`platform\` \`platform\` enum ('web', 'ios', 'android') NOT NULL DEFAULT 'web'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` CHANGE \`platform\` \`platform\` varchar(10) NOT NULL DEFAULT 'mobbile'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`mobileOs\``);
    }

}
