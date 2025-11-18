import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1762756305379 implements MigrationInterface {
    name = 'AutoGen1762756305379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` ADD \`method\` enum ('GOOGLE', 'NAVER', 'EMAIL') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`User\` CHANGE \`role\` \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'ANALYST', 'OPERATER', 'PM', 'QA', 'CS', 'NORMAL') NOT NULL DEFAULT 'PROGRAMMER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` CHANGE \`role\` \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'ANALYST', 'OPERATER', 'PM', 'QA', 'CS') NOT NULL DEFAULT 'PROGRAMMER'`);
        await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`method\``);
    }

}
