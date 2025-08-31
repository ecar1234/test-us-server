import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1755260167647 implements MigrationInterface {
    name = 'AutoGen1755260167647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post\` ADD \`views\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`User\` CHANGE \`role\` \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'ANALYST', 'OPERATER', 'PM', 'QA', 'CS') NOT NULL DEFAULT 'PROGRAMMER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` CHANGE \`role\` \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'ANALYST', 'OPERATER', 'PM', 'QA', 'CS') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`views\``);
    }

}
