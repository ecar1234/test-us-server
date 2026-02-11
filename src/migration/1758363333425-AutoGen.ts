import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1758363333425 implements MigrationInterface {
    name = 'AutoGen1758363333425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Images\` DROP FOREIGN KEY \`FK_8e29dcb1db0fa294b1b705eb083\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD CONSTRAINT \`FK_8e29dcb1db0fa294b1b705eb083\` FOREIGN KEY (\`postId\`) REFERENCES \`Post\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Images\` DROP FOREIGN KEY \`FK_8e29dcb1db0fa294b1b705eb083\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD CONSTRAINT \`FK_8e29dcb1db0fa294b1b705eb083\` FOREIGN KEY (\`postId\`) REFERENCES \`Post\`(\`postId\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
