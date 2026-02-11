import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1769488663381 implements MigrationInterface {
    name = 'AutoGen1769488663381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_ca3c84760fb37c2f14658a0a2e\` ON \`room_members\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_151cb61c3e462093aa3b8e70f7\` ON \`room_members\` (\`roomId\`, \`userId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_151cb61c3e462093aa3b8e70f7\` ON \`room_members\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_ca3c84760fb37c2f14658a0a2e\` ON \`room_members\` (\`userId\`)`);
    }

}
