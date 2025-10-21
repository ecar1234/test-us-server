import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1761037134232 implements MigrationInterface {
    name = 'AutoGen1761037134232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Images\` DROP FOREIGN KEY \`FK_8e29dcb1db0fa294b1b705eb083\``);
        await queryRunner.query(`CREATE TABLE \`PromotionPost\` (\`postId\` varchar(36) NOT NULL, \`title\` varchar(30) NOT NULL, \`subtitle\` varchar(30) NOT NULL, \`contents\` text NOT NULL, \`platform\` text NOT NULL, \`status\` enum ('active', 'expired', 'delete') NOT NULL DEFAULT 'active', \`domain\` text NOT NULL, \`period\` int NOT NULL DEFAULT '7', \`views\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`authorId\` varchar(36) NULL, PRIMARY KEY (\`postId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD \`postType\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`Images\` DROP COLUMN \`postId\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD \`postId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`PromotionPost\` ADD CONSTRAINT \`FK_447fdd5343d39b2d8fd6d269ef4\` FOREIGN KEY (\`authorId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`PromotionPost\` DROP FOREIGN KEY \`FK_447fdd5343d39b2d8fd6d269ef4\``);
        await queryRunner.query(`ALTER TABLE \`Images\` DROP COLUMN \`postId\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD \`postId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Images\` DROP COLUMN \`postType\``);
        await queryRunner.query(`DROP TABLE \`PromotionPost\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD CONSTRAINT \`FK_8e29dcb1db0fa294b1b705eb083\` FOREIGN KEY (\`postId\`) REFERENCES \`RecruitmentPost\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
