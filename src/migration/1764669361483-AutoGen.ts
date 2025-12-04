import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1764669361483 implements MigrationInterface {
    name = 'AutoGen1764669361483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Review\` DROP COLUMN \`rating\``);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD \`rating\` float NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Review\` DROP COLUMN \`rating\``);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD \`rating\` int NOT NULL`);
    }

}
