import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1757480856809 implements MigrationInterface {
    name = 'AutoGen1757480856809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post\` ADD \`images\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`images\``);
    }

}
