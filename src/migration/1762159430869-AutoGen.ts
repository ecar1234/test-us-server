import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1762159430869 implements MigrationInterface {
    name = 'AutoGen1762159430869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`images\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`images\``);
    }

}
