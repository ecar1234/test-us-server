import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1768284938803 implements MigrationInterface {
    name = 'AutoGen1768284938803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Review\` (\`reviewId\` varchar(36) NOT NULL, \`rating\` int NOT NULL, \`comment\` text NULL, \`reviewType\` enum ('PRODUCT_RATING', 'PARTICIPANT_ATTITUDE_RATING') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`appId\` int NULL, \`reviewerUserId\` varchar(36) NULL, \`reviewedUserId\` varchar(36) NULL, UNIQUE INDEX \`IDX_4f0a34566e56fc16f403df3157\` (\`appId\`, \`reviewerUserId\`, \`reviewedUserId\`), PRIMARY KEY (\`reviewId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Post\` (\`postId\` varchar(36) NOT NULL, \`title\` varchar(30) NOT NULL, \`subtitle\` varchar(100) NOT NULL, \`platform\` text NOT NULL, \`contents\` text NOT NULL, \`status\` enum ('active', 'end', 'expired', 'delete') NOT NULL DEFAULT 'active', \`period\` int NOT NULL DEFAULT '7', \`views\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`authorId\` varchar(36) NULL, PRIMARY KEY (\`postId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`mobileOs\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`category\` enum ('game', 'travel', 'developerTool', 'health', 'education', 'finance', 'weather', 'news', 'books', 'life', 'business', 'photography', 'social', 'sports', 'shopping', 'food', 'utility', 'medical', 'magazine', 'music', 'entertainment', 'etc') NOT NULL DEFAULT 'etc'`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`mobileOs\` enum ('android', 'ios') NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`type\` \`type\` enum ('INDIVIDUALS', 'COMPANIES', 'NORMAL') NOT NULL DEFAULT 'INDIVIDUALS'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'ANALYST', 'OPERATER', 'PM', 'QA', 'CS', 'USER') NOT NULL DEFAULT 'PROGRAMMER'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`platform\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`platform\` varchar(10) NOT NULL DEFAULT 'mobile'`);
        await queryRunner.query(`ALTER TABLE \`applications\` CHANGE \`platform\` \`platform\` enum ('web', 'mobile') NOT NULL DEFAULT 'web'`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_a288164d612073c96cbeeb9075c\` FOREIGN KEY (\`appId\`) REFERENCES \`applications\`(\`appId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_3e901cbb9f32cffeb31425e1b87\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_a8bad6d5267a5c873dd1b026454\` FOREIGN KEY (\`reviewedUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD CONSTRAINT \`FK_cef8d6e8edb69c82e5f10bb4026\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post\` DROP FOREIGN KEY \`FK_cef8d6e8edb69c82e5f10bb4026\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_a8bad6d5267a5c873dd1b026454\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_3e901cbb9f32cffeb31425e1b87\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_a288164d612073c96cbeeb9075c\``);
        await queryRunner.query(`ALTER TABLE \`applications\` CHANGE \`platform\` \`platform\` enum ('web', 'ios', 'android') NOT NULL DEFAULT 'web'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`platform\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`platform\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'ANALYST', 'OPERATER', 'PM', 'QA', 'CS', 'NORMAL') NOT NULL DEFAULT 'PROGRAMMER'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`type\` \`type\` enum ('INDIVIDUALS', 'COMPANIES') NOT NULL DEFAULT 'INDIVIDUALS'`);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`mobileOs\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`category\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`mobileOs\``);
        await queryRunner.query(`DROP TABLE \`Post\``);
        await queryRunner.query(`DROP INDEX \`IDX_4f0a34566e56fc16f403df3157\` ON \`Review\``);
        await queryRunner.query(`DROP TABLE \`Review\``);
    }

}
