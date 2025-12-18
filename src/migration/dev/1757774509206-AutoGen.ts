import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1757774509206 implements MigrationInterface {
    name = 'AutoGen1757774509206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`images\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD \`postId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Images\` DROP COLUMN \`size\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD \`size\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD CONSTRAINT \`FK_8e29dcb1db0fa294b1b705eb083\` FOREIGN KEY (\`postId\`) REFERENCES \`Post\`(\`postId\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Images\` DROP FOREIGN KEY \`FK_8e29dcb1db0fa294b1b705eb083\``);
        await queryRunner.query(`ALTER TABLE \`Images\` DROP COLUMN \`size\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD \`size\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Images\` DROP COLUMN \`postId\``);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD \`images\` text NULL`);
    }

}
