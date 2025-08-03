import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1754131797760 implements MigrationInterface {
    name = 'AutoGen1754131797760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` ADD \`birth\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`User\` CHANGE \`userName\` \`userName\` varchar(20) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` CHANGE \`userName\` \`userName\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`birth\``);
    }

}
