import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1761029387834 implements MigrationInterface {
    name = 'AutoGen1761029387834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Application\` CHANGE \`platform\` \`platform\` enum ('web', 'ios', 'android', 'game') NOT NULL DEFAULT 'web'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Application\` CHANGE \`platform\` \`platform\` enum ('web', 'ios', 'android') NOT NULL DEFAULT 'web'`);
    }

}
