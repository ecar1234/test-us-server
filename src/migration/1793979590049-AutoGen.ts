import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1793979590049 implements MigrationInterface {
    name = 'AutoGen1793979590049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`project_role_entity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`roleName\` varchar(255) NOT NULL, \`requiredCount\` int NOT NULL DEFAULT '0', \`currentCount\` int NOT NULL DEFAULT '0', \`isClosed\` tinyint NOT NULL DEFAULT 0, \`postId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`requiredTesters\` int NULL COMMENT '필요한 테스터 인원 수'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`reward\` varchar(255) NULL COMMENT '테스터 보상 내용'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`testStartDate\` datetime NULL COMMENT '테스트 시작 일시'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`testEndDate\` datetime NULL COMMENT '테스트 종료 일시'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`sprintDutations\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`referenceLink\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`expiredAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` CHANGE \`platform\` \`platform\` varchar(10) NULL DEFAULT 'mobile'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` CHANGE \`category\` \`category\` enum ('game', 'travel', 'developerTool', 'health', 'education', 'finance', 'weather', 'news', 'books', 'life', 'business', 'photography', 'social', 'sports', 'shopping', 'food', 'utility', 'medical', 'magazine', 'music', 'entertainment', 'etc') NULL DEFAULT 'etc'`);
        await queryRunner.query(`ALTER TABLE \`applications\` CHANGE \`platform\` \`platform\` enum ('web', 'mobile', 'empty') NOT NULL DEFAULT 'web'`);
        await queryRunner.query(`ALTER TABLE \`project_role_entity\` ADD CONSTRAINT \`FK_56a1cf3a8b2b5c887992bae540c\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_role_entity\` DROP FOREIGN KEY \`FK_56a1cf3a8b2b5c887992bae540c\``);
        await queryRunner.query(`ALTER TABLE \`applications\` CHANGE \`platform\` \`platform\` enum ('web', 'mobile') NOT NULL DEFAULT 'web'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` CHANGE \`category\` \`category\` enum ('game', 'travel', 'developerTool', 'health', 'education', 'finance', 'weather', 'news', 'books', 'life', 'business', 'photography', 'social', 'sports', 'shopping', 'food', 'utility', 'medical', 'magazine', 'music', 'entertainment', 'etc') NOT NULL DEFAULT 'etc'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` CHANGE \`platform\` \`platform\` varchar(10) NOT NULL DEFAULT 'mobile'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`expiredAt\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`referenceLink\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`sprintDutations\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`testEndDate\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`testStartDate\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`reward\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`requiredTesters\``);
        await queryRunner.query(`DROP TABLE \`project_role_entity\``);
    }

}
