import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1754747488245 implements MigrationInterface {
    name = 'AutoGen1754747488245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE \`User\` ADD \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'PM', 'QA', 'CS') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`User\` CHANGE \`type\` \`type\` enum ('INDIVIDUALS', 'COMPANIES') NOT NULL DEFAULT 'INDIVIDUALS'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` CHANGE \`type\` \`type\` enum ('INDVIDUALS', 'COMPANIES') NOT NULL DEFAULT 'INDVIDUALS'`);
        // await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`role\``);
    }

}
