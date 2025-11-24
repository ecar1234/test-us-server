import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1763970956239 implements MigrationInterface {
    name = 'AutoGen1763970956239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` CHANGE \`method\` \`method\` enum ('GOOGLE', 'NAVER', 'EMAIL') NOT NULL DEFAULT 'EMAIL'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` CHANGE \`method\` \`method\` enum ('GOOGLE', 'NAVER', 'EMAIL') NOT NULL`);
    }

}
