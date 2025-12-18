import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1754787931497 implements MigrationInterface {
    name = 'AutoGen1754787931497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` CHANGE \`type\` \`type\` enum ('INDIVIDUALS', 'COMPANIES') NOT NULL DEFAULT 'INDIVIDUALS'`);
        await queryRunner.query(`ALTER TABLE \`User\` CHANGE \`role\` \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'ANALYST', 'OPERATER', 'PM', 'QA', 'CS') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` CHANGE \`role\` \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'PM', 'QA', 'CS') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`User\` CHANGE \`type\` \`type\` enum ('INDVIDUALS', 'COMPANIES') NOT NULL DEFAULT 'INDVIDUALS'`);
    }

}
