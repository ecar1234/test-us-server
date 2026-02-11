import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1770788344578 implements MigrationInterface {
    name = 'AutoGen1770788344578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_0c484446b401e67b72f451faae\` ON \`rooms\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`mobileOs\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`mobileOs\` enum ('android', 'ios') NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP COLUMN \`mobileOs\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD \`mobileOs\` text NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_0c484446b401e67b72f451faae\` ON \`rooms\` (\`last_message_id\`)`);
    }

}
