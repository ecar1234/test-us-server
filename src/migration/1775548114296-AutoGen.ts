import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1775548114296 implements MigrationInterface {
    name = 'AutoGen1775548114296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`state\` enum ('purchased', 'canceled', 'expired', 'renew') NOT NULL DEFAULT 'purchased'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`state\``);
    }

}
