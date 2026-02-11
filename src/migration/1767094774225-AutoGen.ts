import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1767094774225 implements MigrationInterface {
    name = 'AutoGen1767094774225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`mobileOs\` varchar(10) NULL`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`category\` enum ('game', 'travel', 'developerTool', 'health', 'education', 'finance', 'weather', 'news', 'books', 'life', 'business', 'photography', 'social', 'sports', 'shopping', 'food', 'utility', 'medical', 'magazine', 'music', 'entertainment', 'etc') NOT NULL DEFAULT 'etc'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`type\` \`type\` enum ('INDIVIDUALS', 'COMPANIES', 'NORMAL') NOT NULL DEFAULT 'INDIVIDUALS'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'ANALYST', 'OPERATER', 'PM', 'QA', 'CS', 'USER') NOT NULL DEFAULT 'PROGRAMMER'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`platform\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`platform\` varchar(10) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`platform\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`platform\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'ANALYST', 'OPERATER', 'PM', 'QA', 'CS', 'NORMAL') NOT NULL DEFAULT 'PROGRAMMER'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`type\` \`type\` enum ('INDIVIDUALS', 'COMPANIES') NOT NULL DEFAULT 'INDIVIDUALS'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`category\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`mobileOs\``);
    }

}
