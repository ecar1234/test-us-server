import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1762415333950 implements MigrationInterface {
    name = 'AutoGen1762415333950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` ADD \`image\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`image\``);
    }

}
