import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1754224859563 implements MigrationInterface {
    name = 'AutoGen1754224859563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post\` CHANGE \`status\` \`status\` enum ('active', 'end', 'expired', 'delete') NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post\` CHANGE \`status\` \`status\` enum ('active', 'end', 'expired') NOT NULL DEFAULT 'active'`);
    }

}
