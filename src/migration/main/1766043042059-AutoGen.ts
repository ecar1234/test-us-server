import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1766043042059 implements MigrationInterface {
    name = 'AutoGen1766043042059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`messages\` (\`messageId\` varchar(36) NOT NULL, \`contents\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`readAt\` timestamp NULL, \`deleteSender\` tinyint NOT NULL DEFAULT 0, \`deleteReceiver\` tinyint NOT NULL DEFAULT 0, \`senderUserId\` varchar(36) NULL, \`receiverUserId\` varchar(36) NULL, UNIQUE INDEX \`IDX_9743b3cec687ac55895f0d79ae\` (\`messageId\`), PRIMARY KEY (\`messageId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`device_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`deviceType\` varchar(50) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` varchar(36) NULL, INDEX \`IDX_511957e3e8443429dc3fb00120\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`userId\` varchar(36) NOT NULL, \`email\` varchar(50) NOT NULL, \`password_hash\` varchar(60) NOT NULL, \`nickname\` varchar(20) NOT NULL, \`userName\` varchar(20) NULL, \`birth\` date NULL, \`type\` enum ('INDIVIDUALS', 'COMPANIES') NOT NULL DEFAULT 'INDIVIDUALS', \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'ANALYST', 'OPERATER', 'PM', 'QA', 'CS', 'NORMAL') NOT NULL DEFAULT 'PROGRAMMER', \`status\` enum ('ACTIVE', 'INACTIVE', 'DELETED') NOT NULL DEFAULT 'ACTIVE', \`image\` text NULL, \`method\` enum ('GOOGLE', 'NAVER', 'EMAIL') NOT NULL DEFAULT 'EMAIL', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_2ade55fa1ac34cb086a73998b9\` (\`email\`, \`nickname\`), PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_reviews\` (\`reviewId\` varchar(36) NOT NULL, \`rating\` float NOT NULL, \`comment\` text NULL, \`reviewType\` enum ('PROMOTION', 'RECRUIT') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`reviewerUserId\` varchar(36) NULL, \`postId\` varchar(36) NULL, UNIQUE INDEX \`IDX_d51862c2ad05bed194af31f648\` (\`reviewerUserId\`, \`postId\`), PRIMARY KEY (\`reviewId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`base_post_entity\` (\`postId\` varchar(36) NOT NULL, \`postType\` varchar(255) NOT NULL, \`title\` varchar(30) NOT NULL, \`subtitle\` varchar(100) NOT NULL, \`platform\` text NOT NULL, \`contents\` text NOT NULL, \`images\` text NULL, \`views\` int NOT NULL DEFAULT '0', \`status\` enum ('active', 'expired', 'end', 'delete') NOT NULL DEFAULT 'active', \`period\` int NOT NULL DEFAULT '7', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`domain\` text NULL, \`authorId\` varchar(36) NULL, INDEX \`IDX_e20a30b4251e556c91bd19cf8b\` (\`postType\`), PRIMARY KEY (\`postId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`applications\` (\`appId\` int NOT NULL AUTO_INCREMENT, \`platform\` enum ('web', 'ios', 'android') NOT NULL DEFAULT 'web', \`status\` enum ('pending', 'accepted', 'rejected', 'cancel') NOT NULL DEFAULT 'pending', \`appliedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`postId\` varchar(36) NULL, \`appUserId\` varchar(36) NULL, UNIQUE INDEX \`IDX_6c9d89b4ef4ce7fd39e9e28a37\` (\`postId\`, \`appUserId\`), PRIMARY KEY (\`appId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_reviews\` (\`reviewId\` varchar(36) NOT NULL, \`rating\` float NOT NULL, \`comment\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`appId\` int NULL, \`reviewerUserId\` varchar(36) NULL, \`reviewedUserId\` varchar(36) NULL, UNIQUE INDEX \`IDX_b7fd00599434d50a1699df23fd\` (\`appId\`, \`reviewerUserId\`, \`reviewedUserId\`), PRIMARY KEY (\`reviewId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NOT NULL, \`originalname\` varchar(255) NOT NULL, \`mimetype\` varchar(255) NOT NULL, \`size\` int NOT NULL, \`url\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`postId\` varchar(255) NOT NULL, \`postType\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2868049bbe999cdf09aed764400\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_8a347e1c1f8c61d7af35cd535d1\` FOREIGN KEY (\`receiverUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`device_tokens\` ADD CONSTRAINT \`FK_511957e3e8443429dc3fb00120c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` ADD CONSTRAINT \`FK_d22e66c600c1b9f5faa052659bc\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` ADD CONSTRAINT \`FK_9b98119aba96b34da22716c2fb3\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD CONSTRAINT \`FK_ae42ffbcadfe582ee41251bc405\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_2923022ed48d26d1c4ebfc96af9\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_e237409a253d288b8e0427ad272\` FOREIGN KEY (\`appUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_49793c0da7a9ea0865be59a7936\` FOREIGN KEY (\`appId\`) REFERENCES \`applications\`(\`appId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_ec4cf0c67c9ca5fa95075edc51f\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_23db2cf2e50f9130b5b5f7dcc28\` FOREIGN KEY (\`reviewedUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_23db2cf2e50f9130b5b5f7dcc28\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_ec4cf0c67c9ca5fa95075edc51f\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_49793c0da7a9ea0865be59a7936\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_e237409a253d288b8e0427ad272\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_2923022ed48d26d1c4ebfc96af9\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP FOREIGN KEY \`FK_ae42ffbcadfe582ee41251bc405\``);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` DROP FOREIGN KEY \`FK_9b98119aba96b34da22716c2fb3\``);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` DROP FOREIGN KEY \`FK_d22e66c600c1b9f5faa052659bc\``);
        await queryRunner.query(`ALTER TABLE \`device_tokens\` DROP FOREIGN KEY \`FK_511957e3e8443429dc3fb00120c\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_8a347e1c1f8c61d7af35cd535d1\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2868049bbe999cdf09aed764400\``);
        await queryRunner.query(`DROP TABLE \`Images\``);
        await queryRunner.query(`DROP INDEX \`IDX_b7fd00599434d50a1699df23fd\` ON \`user_reviews\``);
        await queryRunner.query(`DROP TABLE \`user_reviews\``);
        await queryRunner.query(`DROP INDEX \`IDX_6c9d89b4ef4ce7fd39e9e28a37\` ON \`applications\``);
        await queryRunner.query(`DROP TABLE \`applications\``);
        await queryRunner.query(`DROP INDEX \`IDX_e20a30b4251e556c91bd19cf8b\` ON \`base_post_entity\``);
        await queryRunner.query(`DROP TABLE \`base_post_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_d51862c2ad05bed194af31f648\` ON \`post_reviews\``);
        await queryRunner.query(`DROP TABLE \`post_reviews\``);
        await queryRunner.query(`DROP INDEX \`IDX_2ade55fa1ac34cb086a73998b9\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_511957e3e8443429dc3fb00120\` ON \`device_tokens\``);
        await queryRunner.query(`DROP TABLE \`device_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_9743b3cec687ac55895f0d79ae\` ON \`messages\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
    }

}
