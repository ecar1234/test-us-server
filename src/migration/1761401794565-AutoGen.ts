import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1761401794565 implements MigrationInterface {
    name = 'AutoGen1761401794565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Images\` DROP FOREIGN KEY \`FK_8e29dcb1db0fa294b1b705eb083\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD \`postType\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Images\` DROP COLUMN \`postId\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD \`postId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` CHANGE \`platform\` \`platform\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` CHANGE \`status\` \`status\` enum ('active', 'expired', 'end', 'delete') NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` CHANGE \`period\` \`period\` int NOT NULL DEFAULT '7'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` CHANGE \`period\` \`period\` int NULL DEFAULT '7'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` CHANGE \`status\` \`status\` enum ('active', 'end', 'expired', 'delete') NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` CHANGE \`platform\` \`platform\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`Images\` DROP COLUMN \`postId\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD \`postId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Images\` DROP COLUMN \`postType\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD CONSTRAINT \`FK_8e29dcb1db0fa294b1b705eb083\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
