import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1783492543862 implements MigrationInterface {
    name = 'AutoGen1783492543862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`purchase_event_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`eventType\` varchar(255) NOT NULL, \`appUserId\` varchar(255) NOT NULL, \`platform\` varchar(255) NOT NULL, \`payload\` json NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NOT NULL, \`originalname\` varchar(255) NOT NULL, \`mimetype\` varchar(255) NOT NULL, \`size\` int NOT NULL, \`url\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`postId\` varchar(255) NOT NULL, \`postType\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`base_post_entity\` (\`postId\` varchar(36) NOT NULL, \`postType\` varchar(255) NOT NULL, \`title\` varchar(30) NOT NULL, \`subtitle\` varchar(100) NOT NULL, \`platform\` varchar(10) NOT NULL DEFAULT 'mobile', \`mobileOs\` enum ('android', 'ios') NULL, \`category\` enum ('game', 'travel', 'developerTool', 'health', 'education', 'finance', 'weather', 'news', 'books', 'life', 'business', 'photography', 'social', 'sports', 'shopping', 'food', 'utility', 'medical', 'magazine', 'music', 'entertainment', 'etc') NOT NULL DEFAULT 'etc', \`contents\` text NOT NULL, \`images\` text NULL, \`views\` int NOT NULL DEFAULT '0', \`status\` enum ('active', 'expired', 'end', 'delete') NOT NULL DEFAULT 'active', \`period\` int NOT NULL DEFAULT '7', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`domain\` text NULL, \`authorId\` varchar(36) NULL, INDEX \`IDX_e20a30b4251e556c91bd19cf8b\` (\`postType\`), PRIMARY KEY (\`postId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`applications\` (\`appId\` int NOT NULL AUTO_INCREMENT, \`platform\` enum ('web', 'mobile') NOT NULL DEFAULT 'web', \`mobileOs\` enum ('android', 'ios') NULL, \`status\` enum ('pending', 'accepted', 'rejected', 'cancel') NOT NULL DEFAULT 'pending', \`appliedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`postId\` varchar(36) NULL, \`appUserId\` varchar(36) NULL, UNIQUE INDEX \`IDX_6c9d89b4ef4ce7fd39e9e28a37\` (\`postId\`, \`appUserId\`), PRIMARY KEY (\`appId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`userId\` varchar(36) NOT NULL, \`email\` varchar(50) NOT NULL, \`password_hash\` varchar(60) NOT NULL, \`nickname\` varchar(20) NOT NULL, \`userName\` varchar(20) NULL, \`birth\` date NULL, \`type\` enum ('INDIVIDUALS', 'COMPANIES', 'NORMAL') NOT NULL DEFAULT 'INDIVIDUALS', \`role\` enum ('PROGRAMMER', 'DESIGNER', 'PUBLISHER', 'PLANNER', 'MANAGER', 'MARKETER', 'ANALYST', 'OPERATER', 'PM', 'QA', 'CS', 'USER') NOT NULL DEFAULT 'PROGRAMMER', \`status\` enum ('ACTIVE', 'INACTIVE', 'DELETED') NOT NULL DEFAULT 'ACTIVE', \`image\` text NULL, \`method\` enum ('GOOGLE', 'NAVER', 'EMAIL') NOT NULL DEFAULT 'EMAIL', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_2ade55fa1ac34cb086a73998b9\` (\`email\`, \`nickname\`), PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post_reviews\` (\`reviewId\` varchar(36) NOT NULL, \`rating\` float NOT NULL, \`comment\` text NULL, \`reviewType\` enum ('PROMOTION', 'RECRUIT') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`reviewerUserId\` varchar(36) NULL, \`postId\` varchar(36) NULL, UNIQUE INDEX \`IDX_d51862c2ad05bed194af31f648\` (\`reviewerUserId\`, \`postId\`), PRIMARY KEY (\`reviewId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_reviews\` (\`reviewId\` varchar(36) NOT NULL, \`rating\` float NOT NULL, \`comment\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`appId\` int NULL, \`reviewerUserId\` varchar(36) NULL, \`reviewedUserId\` varchar(36) NULL, UNIQUE INDEX \`IDX_b7fd00599434d50a1699df23fd\` (\`appId\`, \`reviewerUserId\`, \`reviewedUserId\`), PRIMARY KEY (\`reviewId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`device_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`deviceType\` varchar(50) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` varchar(36) NULL, INDEX \`IDX_511957e3e8443429dc3fb00120\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`purchases\` (\`id\` int NOT NULL AUTO_INCREMENT, \`plan\` varchar(255) NOT NULL, \`productId\` varchar(255) NOT NULL, \`store\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL, \`willRenew\` tinyint NOT NULL, \`state\` enum ('purchased', 'canceled', 'expired', 'renew', 'refund') NOT NULL DEFAULT 'purchased', \`expiresAt\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`rootId\` varchar(255) NULL, \`purchaseToken\` varchar(255) NULL, \`linkedPurchaseToken\` varchar(255) NULL, \`transactionId\` varchar(255) NULL, \`originalTransactionsId\` varchar(255) NULL, \`userId\` varchar(36) NULL, INDEX \`IDX_fadb0613d9d1d67f9bffcb2a9a\` (\`originalTransactionsId\`), UNIQUE INDEX \`IDX_242ac577cf6109f1725dc14348\` (\`purchaseToken\`), UNIQUE INDEX \`IDX_7781b8ef95e9d9f742bb7d00f5\` (\`transactionId\`), INDEX \`IDX_26138e638bdd8825e36d01d898\` (\`store\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`room_members\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` varchar(255) NOT NULL, \`unreadCount\` int NOT NULL DEFAULT '0', \`lastReadMessageId\` int NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`joinedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`roomId\` int NULL, UNIQUE INDEX \`IDX_151cb61c3e462093aa3b8e70f7\` (\`roomId\`, \`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rooms\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('DM', 'GROUP') NOT NULL, \`targetUserId\` varchar(255) NULL, \`lastMessageContent\` varchar(255) NULL, \`lastMessageAt\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`postPostId\` varchar(36) NULL, \`last_message_id\` int NULL, UNIQUE INDEX \`REL_0c484446b401e67b72f451faae\` (\`last_message_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`roomId\` int NULL, \`senderUserId\` varchar(36) NULL, INDEX \`IDX_aaa8a6effc7bd20a1172d3a3bc\` (\`roomId\`), INDEX \`IDX_6ce6acdb0801254590f8a78c08\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD CONSTRAINT \`FK_ae42ffbcadfe582ee41251bc405\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_2923022ed48d26d1c4ebfc96af9\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_e237409a253d288b8e0427ad272\` FOREIGN KEY (\`appUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` ADD CONSTRAINT \`FK_d22e66c600c1b9f5faa052659bc\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` ADD CONSTRAINT \`FK_9b98119aba96b34da22716c2fb3\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_49793c0da7a9ea0865be59a7936\` FOREIGN KEY (\`appId\`) REFERENCES \`applications\`(\`appId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_ec4cf0c67c9ca5fa95075edc51f\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_23db2cf2e50f9130b5b5f7dcc28\` FOREIGN KEY (\`reviewedUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`device_tokens\` ADD CONSTRAINT \`FK_511957e3e8443429dc3fb00120c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD CONSTRAINT \`FK_341f0dbe584866284359f30f3da\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_ca3c84760fb37c2f14658a0a2ec\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_a27f901523ddfa2eaecb16a5976\` FOREIGN KEY (\`roomId\`) REFERENCES \`rooms\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_f9de41aa1a29ad962263515d130\` FOREIGN KEY (\`postPostId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_0c484446b401e67b72f451faae6\` FOREIGN KEY (\`last_message_id\`) REFERENCES \`messages\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_aaa8a6effc7bd20a1172d3a3bc8\` FOREIGN KEY (\`roomId\`) REFERENCES \`rooms\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2868049bbe999cdf09aed764400\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2868049bbe999cdf09aed764400\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_aaa8a6effc7bd20a1172d3a3bc8\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_0c484446b401e67b72f451faae6\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_f9de41aa1a29ad962263515d130\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_a27f901523ddfa2eaecb16a5976\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_ca3c84760fb37c2f14658a0a2ec\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP FOREIGN KEY \`FK_341f0dbe584866284359f30f3da\``);
        await queryRunner.query(`ALTER TABLE \`device_tokens\` DROP FOREIGN KEY \`FK_511957e3e8443429dc3fb00120c\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_23db2cf2e50f9130b5b5f7dcc28\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_ec4cf0c67c9ca5fa95075edc51f\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_49793c0da7a9ea0865be59a7936\``);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` DROP FOREIGN KEY \`FK_9b98119aba96b34da22716c2fb3\``);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` DROP FOREIGN KEY \`FK_d22e66c600c1b9f5faa052659bc\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_e237409a253d288b8e0427ad272\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_2923022ed48d26d1c4ebfc96af9\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP FOREIGN KEY \`FK_ae42ffbcadfe582ee41251bc405\``);
        await queryRunner.query(`DROP INDEX \`IDX_6ce6acdb0801254590f8a78c08\` ON \`messages\``);
        await queryRunner.query(`DROP INDEX \`IDX_aaa8a6effc7bd20a1172d3a3bc\` ON \`messages\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
        await queryRunner.query(`DROP INDEX \`REL_0c484446b401e67b72f451faae\` ON \`rooms\``);
        await queryRunner.query(`DROP TABLE \`rooms\``);
        await queryRunner.query(`DROP INDEX \`IDX_151cb61c3e462093aa3b8e70f7\` ON \`room_members\``);
        await queryRunner.query(`DROP TABLE \`room_members\``);
        await queryRunner.query(`DROP INDEX \`IDX_26138e638bdd8825e36d01d898\` ON \`purchases\``);
        await queryRunner.query(`DROP INDEX \`IDX_7781b8ef95e9d9f742bb7d00f5\` ON \`purchases\``);
        await queryRunner.query(`DROP INDEX \`IDX_242ac577cf6109f1725dc14348\` ON \`purchases\``);
        await queryRunner.query(`DROP INDEX \`IDX_fadb0613d9d1d67f9bffcb2a9a\` ON \`purchases\``);
        await queryRunner.query(`DROP TABLE \`purchases\``);
        await queryRunner.query(`DROP INDEX \`IDX_511957e3e8443429dc3fb00120\` ON \`device_tokens\``);
        await queryRunner.query(`DROP TABLE \`device_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_b7fd00599434d50a1699df23fd\` ON \`user_reviews\``);
        await queryRunner.query(`DROP TABLE \`user_reviews\``);
        await queryRunner.query(`DROP INDEX \`IDX_d51862c2ad05bed194af31f648\` ON \`post_reviews\``);
        await queryRunner.query(`DROP TABLE \`post_reviews\``);
        await queryRunner.query(`DROP INDEX \`IDX_2ade55fa1ac34cb086a73998b9\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_6c9d89b4ef4ce7fd39e9e28a37\` ON \`applications\``);
        await queryRunner.query(`DROP TABLE \`applications\``);
        await queryRunner.query(`DROP INDEX \`IDX_e20a30b4251e556c91bd19cf8b\` ON \`base_post_entity\``);
        await queryRunner.query(`DROP TABLE \`base_post_entity\``);
        await queryRunner.query(`DROP TABLE \`Images\``);
        await queryRunner.query(`DROP TABLE \`purchase_event_logs\``);
    }

}
