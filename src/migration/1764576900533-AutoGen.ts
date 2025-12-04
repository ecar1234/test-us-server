import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1764576900533 implements MigrationInterface {
    name = 'AutoGen1764576900533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Review\` ADD \`postId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_13ff2ef1a6a1280b5a56df28c9b\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_13ff2ef1a6a1280b5a56df28c9b\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP COLUMN \`postId\``);
    }

}
