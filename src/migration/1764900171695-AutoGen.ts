import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1764900171695 implements MigrationInterface {
    name = 'AutoGen1764900171695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_d0b58512094e126fa5b0b484ae0\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP COLUMN \`postId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD \`postId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_d0b58512094e126fa5b0b484ae0\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
