import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1785070239053 implements MigrationInterface {
    name = 'AutoGen1785070239053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`type\` \`type\` enum ('INDIVIDUALS', 'COMPANIES', 'NORMAL', 'MASTER') NOT NULL DEFAULT 'INDIVIDUALS'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`type\` \`type\` enum ('INDIVIDUALS', 'COMPANIES', 'NORMAL') NOT NULL DEFAULT 'INDIVIDUALS'`);
    }

}
