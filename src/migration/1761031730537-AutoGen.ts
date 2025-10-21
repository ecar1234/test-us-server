import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1761031730537 implements MigrationInterface {
    name = 'AutoGen1761031730537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_8e29dcb1db0fa294b1b705eb083\` ON \`Images\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD CONSTRAINT \`FK_8e29dcb1db0fa294b1b705eb083\` FOREIGN KEY (\`postId\`) REFERENCES \`RecruitmentPost\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`RecruitmentPost\` ADD CONSTRAINT \`FK_e4db48d25e599db47de6229dfad\` FOREIGN KEY (\`authorId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Application\` ADD CONSTRAINT \`FK_b9f2941c3f2cb100ef280530e95\` FOREIGN KEY (\`postId\`) REFERENCES \`RecruitmentPost\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Application\` DROP FOREIGN KEY \`FK_b9f2941c3f2cb100ef280530e95\``);
        await queryRunner.query(`ALTER TABLE \`RecruitmentPost\` DROP FOREIGN KEY \`FK_e4db48d25e599db47de6229dfad\``);
        await queryRunner.query(`ALTER TABLE \`Images\` DROP FOREIGN KEY \`FK_8e29dcb1db0fa294b1b705eb083\``);
        await queryRunner.query(`CREATE INDEX \`FK_8e29dcb1db0fa294b1b705eb083\` ON \`Images\` (\`postId\`)`);
    }

}
