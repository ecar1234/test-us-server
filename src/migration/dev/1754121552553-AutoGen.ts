import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1754121552553 implements MigrationInterface {
    name = 'AutoGen1754121552553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`password_hash\``);
        await queryRunner.query(`ALTER TABLE \`User\` ADD \`password_hash\` varchar(60) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`password_hash\``);
        await queryRunner.query(`ALTER TABLE \`User\` ADD \`password_hash\` varchar(20) NOT NULL`);
    }

}
