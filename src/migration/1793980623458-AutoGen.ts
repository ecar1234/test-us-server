import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1793980623458 implements MigrationInterface {
    name = 'AutoGen1793980623458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_role_entity\` DROP COLUMN \`roleName\``);
        await queryRunner.query(`ALTER TABLE \`project_role_entity\` ADD \`roleName\` varchar(10) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_role_entity\` DROP COLUMN \`roleName\``);
        await queryRunner.query(`ALTER TABLE \`project_role_entity\` ADD \`roleName\` varchar(255) NOT NULL`);
    }

}
