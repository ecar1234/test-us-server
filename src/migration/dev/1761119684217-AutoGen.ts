import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1761119684217 implements MigrationInterface {
    name = 'AutoGen1761119684217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Application\` DROP FOREIGN KEY \`FK_b9f2941c3f2cb100ef280530e95\``);
        await queryRunner.query(`CREATE TABLE \`base_post_entity\` (\`postId\` varchar(36) NOT NULL, \`title\` varchar(30) NOT NULL, \`subtitle\` varchar(100) NOT NULL, \`contents\` text NOT NULL, \`views\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`platform\` text NULL, \`status\` enum ('active', 'end', 'expired', 'delete') NULL DEFAULT 'active', \`period\` int NULL DEFAULT '7', \`domain\` text NULL, \`postType\` varchar(255) NOT NULL, \`authorId\` varchar(36) NULL, INDEX \`IDX_e20a30b4251e556c91bd19cf8b\` (\`postType\`), PRIMARY KEY (\`postId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Images\` DROP COLUMN \`postType\``);
        await queryRunner.query(`ALTER TABLE \`Images\` DROP COLUMN \`postId\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD \`postId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD CONSTRAINT \`FK_8e29dcb1db0fa294b1b705eb083\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD CONSTRAINT \`FK_ae42ffbcadfe582ee41251bc405\` FOREIGN KEY (\`authorId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Application\` ADD CONSTRAINT \`FK_b9f2941c3f2cb100ef280530e95\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Application\` DROP FOREIGN KEY \`FK_b9f2941c3f2cb100ef280530e95\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP FOREIGN KEY \`FK_ae42ffbcadfe582ee41251bc405\``);
        await queryRunner.query(`ALTER TABLE \`Images\` DROP FOREIGN KEY \`FK_8e29dcb1db0fa294b1b705eb083\``);
        await queryRunner.query(`ALTER TABLE \`Images\` DROP COLUMN \`postId\``);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD \`postId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`Images\` ADD \`postType\` varchar(255) NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_e20a30b4251e556c91bd19cf8b\` ON \`base_post_entity\``);
        await queryRunner.query(`DROP TABLE \`base_post_entity\``);
        await queryRunner.query(`ALTER TABLE \`Application\` ADD CONSTRAINT \`FK_b9f2941c3f2cb100ef280530e95\` FOREIGN KEY (\`postId\`) REFERENCES \`RecruitmentPost\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
