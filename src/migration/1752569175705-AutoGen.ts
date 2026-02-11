import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1752569175705 implements MigrationInterface {
    name = 'AutoGen1752569175705'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post\` DROP FOREIGN KEY \`FK_8b688f2d8d7161ed1be09d452e3\``);
        await queryRunner.query(`ALTER TABLE \`Messages\` CHANGE \`createAt\` \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`createAt\``);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`updateAt\``);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`author_user_id\``);
        await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`createAt\``);
        await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`updateAt\``);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD \`authorId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`User\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`User\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD CONSTRAINT \`FK_cef8d6e8edb69c82e5f10bb4026\` FOREIGN KEY (\`authorId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Post\` DROP FOREIGN KEY \`FK_cef8d6e8edb69c82e5f10bb4026\``);
        await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`authorId\``);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`User\` ADD \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`User\` ADD \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD \`author_user_id\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`Messages\` CHANGE \`createdAt\` \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD CONSTRAINT \`FK_8b688f2d8d7161ed1be09d452e3\` FOREIGN KEY (\`author_user_id\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
