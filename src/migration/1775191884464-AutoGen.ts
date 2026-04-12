import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1775191884464 implements MigrationInterface {
    name = 'AutoGen1775191884464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`purchaseDate\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`plan\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`isActive\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`willRenew\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`purchaseToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`receipt\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`receipt\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`purchaseToken\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`willRenew\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`isActive\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`plan\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`purchaseDate\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`status\` varchar(255) NOT NULL`);
    }

}
