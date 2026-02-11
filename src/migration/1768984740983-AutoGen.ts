import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1768984740983 implements MigrationInterface {
    name = 'AutoGen1768984740983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2868049bbe999cdf09aed764400\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_8a347e1c1f8c61d7af35cd535d1\``);
        await queryRunner.query(`DROP INDEX \`IDX_9743b3cec687ac55895f0d79ae\` ON \`messages\``);
        await queryRunner.query(`CREATE TABLE \`room_members\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` varchar(255) NOT NULL, \`unreadCount\` int NOT NULL DEFAULT '0', \`lastReadMessageId\` int NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`joinedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userUserId\` varchar(36) NULL, \`roomId\` int NULL, UNIQUE INDEX \`IDX_ca3c84760fb37c2f14658a0a2e\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rooms\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('DM', 'GROUP') NOT NULL, \`targetUserId\` varchar(255) NULL, \`lastMessageContent\` varchar(255) NULL, \`lastMessageAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`postPostId\` varchar(36) NULL, \`lastMessageId\` int NULL, UNIQUE INDEX \`REL_18832b4828b9b929257cb6d50c\` (\`lastMessageId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`contents\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`deleteReceiver\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`deleteSender\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`messageId\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`readAt\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`receiverUserId\``);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`content\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`roomId\` int NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_aaa8a6effc7bd20a1172d3a3bc\` ON \`messages\` (\`roomId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_6ce6acdb0801254590f8a78c08\` ON \`messages\` (\`createdAt\`)`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_bb5e44cc2aa1d12e23f267dd51d\` FOREIGN KEY (\`userUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_a27f901523ddfa2eaecb16a5976\` FOREIGN KEY (\`roomId\`) REFERENCES \`rooms\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_f9de41aa1a29ad962263515d130\` FOREIGN KEY (\`postPostId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_18832b4828b9b929257cb6d50c5\` FOREIGN KEY (\`lastMessageId\`) REFERENCES \`messages\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_aaa8a6effc7bd20a1172d3a3bc8\` FOREIGN KEY (\`roomId\`) REFERENCES \`rooms\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2868049bbe999cdf09aed764400\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2868049bbe999cdf09aed764400\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_aaa8a6effc7bd20a1172d3a3bc8\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_18832b4828b9b929257cb6d50c5\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_f9de41aa1a29ad962263515d130\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_a27f901523ddfa2eaecb16a5976\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_bb5e44cc2aa1d12e23f267dd51d\``);
        await queryRunner.query(`DROP INDEX \`IDX_6ce6acdb0801254590f8a78c08\` ON \`messages\``);
        await queryRunner.query(`DROP INDEX \`IDX_aaa8a6effc7bd20a1172d3a3bc\` ON \`messages\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`roomId\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`receiverUserId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`readAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`messageId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD PRIMARY KEY (\`messageId\`)`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`deleteSender\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`deleteReceiver\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`contents\` text NOT NULL`);
        await queryRunner.query(`DROP INDEX \`REL_18832b4828b9b929257cb6d50c\` ON \`rooms\``);
        await queryRunner.query(`DROP TABLE \`rooms\``);
        await queryRunner.query(`DROP INDEX \`IDX_ca3c84760fb37c2f14658a0a2e\` ON \`room_members\``);
        await queryRunner.query(`DROP TABLE \`room_members\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_9743b3cec687ac55895f0d79ae\` ON \`messages\` (\`messageId\`)`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_8a347e1c1f8c61d7af35cd535d1\` FOREIGN KEY (\`receiverUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2868049bbe999cdf09aed764400\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
