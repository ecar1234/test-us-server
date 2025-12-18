import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1752478164901 implements MigrationInterface {
    name = 'AutoGen1752478164901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Review\` (\`reviewId\` varchar(36) NOT NULL, \`rating\` int NOT NULL, \`comment\` text NULL, \`reviewType\` enum ('PRODUCT_RATING', 'PARTICIPANT_ATTITUDE_RATING') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`appId\` varchar(36) NULL, \`reviewerUserId\` varchar(36) NULL, \`reviewedUserId\` varchar(36) NULL, UNIQUE INDEX \`IDX_4f0a34566e56fc16f403df3157\` (\`appId\`, \`reviewerUserId\`, \`reviewedUserId\`), PRIMARY KEY (\`reviewId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Application\` (\`appId\` varchar(36) NOT NULL, \`platform\` enum ('web', 'ios', 'android') NOT NULL DEFAULT 'web', \`status\` enum ('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending', \`appliedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`postId\` varchar(36) NULL, \`appUserId\` varchar(36) NULL, UNIQUE INDEX \`IDX_cba5fa33d48553d7ad0a40f938\` (\`postId\`, \`appUserId\`), PRIMARY KEY (\`appId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Post\` (\`postId\` varchar(36) NOT NULL, \`title\` varchar(30) NOT NULL, \`subtitle\` varchar(100) NOT NULL, \`contents\` text NOT NULL, \`status\` enum ('active', 'end', 'expired') NOT NULL DEFAULT 'active', \`period\` int NOT NULL DEFAULT '7', \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`author_user_id\` varchar(36) NULL, PRIMARY KEY (\`postId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Messages\` (\`messageId\` varchar(36) NOT NULL, \`contents\` text NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`readAt\` timestamp NULL, \`senderUserId\` varchar(36) NULL, \`receiverUserId\` varchar(36) NULL, PRIMARY KEY (\`messageId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`User\` (\`userId\` varchar(255) NOT NULL, \`email\` varchar(50) NOT NULL, \`password_hash\` varchar(20) NOT NULL, \`nickname\` varchar(20) NOT NULL, \`type\` enum ('INDVIDUALS', 'COMPANIES') NOT NULL DEFAULT 'INDVIDUALS', \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a0f06a2598032b44cd96e3a26b\` (\`email\`, \`nickname\`), PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_a288164d612073c96cbeeb9075c\` FOREIGN KEY (\`appId\`) REFERENCES \`Application\`(\`appId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_3e901cbb9f32cffeb31425e1b87\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_a8bad6d5267a5c873dd1b026454\` FOREIGN KEY (\`reviewedUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Application\` ADD CONSTRAINT \`FK_b9f2941c3f2cb100ef280530e95\` FOREIGN KEY (\`postId\`) REFERENCES \`Post\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Application\` ADD CONSTRAINT \`FK_6b9bce3de357b4161cbcd844ca6\` FOREIGN KEY (\`appUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD CONSTRAINT \`FK_8b688f2d8d7161ed1be09d452e3\` FOREIGN KEY (\`author_user_id\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_0d07ae311ec0554a3f9ad8011a2\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_778a3ad424798e5bbdca6f1f484\` FOREIGN KEY (\`receiverUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_778a3ad424798e5bbdca6f1f484\``);
        await queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_0d07ae311ec0554a3f9ad8011a2\``);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP FOREIGN KEY \`FK_8b688f2d8d7161ed1be09d452e3\``);
        await queryRunner.query(`ALTER TABLE \`Application\` DROP FOREIGN KEY \`FK_6b9bce3de357b4161cbcd844ca6\``);
        await queryRunner.query(`ALTER TABLE \`Application\` DROP FOREIGN KEY \`FK_b9f2941c3f2cb100ef280530e95\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_a8bad6d5267a5c873dd1b026454\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_3e901cbb9f32cffeb31425e1b87\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_a288164d612073c96cbeeb9075c\``);
        await queryRunner.query(`DROP INDEX \`IDX_a0f06a2598032b44cd96e3a26b\` ON \`User\``);
        await queryRunner.query(`DROP TABLE \`User\``);
        await queryRunner.query(`DROP TABLE \`Messages\``);
        await queryRunner.query(`DROP TABLE \`Post\``);
        await queryRunner.query(`DROP INDEX \`IDX_cba5fa33d48553d7ad0a40f938\` ON \`Application\``);
        await queryRunner.query(`DROP TABLE \`Application\``);
        await queryRunner.query(`DROP INDEX \`IDX_4f0a34566e56fc16f403df3157\` ON \`Review\``);
        await queryRunner.query(`DROP TABLE \`Review\``);
    }

}
