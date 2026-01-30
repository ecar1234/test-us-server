import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1769788774263 implements MigrationInterface {
    name = 'AutoGen1769788774263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_6ce6acdb0801254590f8a78c08\` ON \`messages\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP COLUMN \`userUserId\``);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`roomId\``);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`content\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`roomId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`messageId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`messageId\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD PRIMARY KEY (\`id\`, \`messageId\`)`);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`id\` \`messageId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD UNIQUE INDEX \`IDX_9743b3cec687ac55895f0d79ae\` (\`messageId\`)`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`contents\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`readAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`deleteSender\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`deleteReceiver\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`receiverUserId\` varchar(36) NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_aaa8a6effc7bd20a1172d3a3bc\` ON \`messages\` (\`roomId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_6ce6acdb0801254590f8a78c08\` ON \`messages\` (\`createdAt\`)`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_ca3c84760fb37c2f14658a0a2ec\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_a27f901523ddfa2eaecb16a5976\` FOREIGN KEY (\`roomId\`) REFERENCES \`rooms\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_f9de41aa1a29ad962263515d130\` FOREIGN KEY (\`postPostId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_0c484446b401e67b72f451faae6\` FOREIGN KEY (\`last_message_id\`) REFERENCES \`messages\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_aaa8a6effc7bd20a1172d3a3bc8\` FOREIGN KEY (\`roomId\`) REFERENCES \`rooms\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2868049bbe999cdf09aed764400\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`device_tokens\` ADD CONSTRAINT \`FK_511957e3e8443429dc3fb00120c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` ADD CONSTRAINT \`FK_d22e66c600c1b9f5faa052659bc\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` ADD CONSTRAINT \`FK_9b98119aba96b34da22716c2fb3\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD CONSTRAINT \`FK_ae42ffbcadfe582ee41251bc405\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_2923022ed48d26d1c4ebfc96af9\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_e237409a253d288b8e0427ad272\` FOREIGN KEY (\`appUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_49793c0da7a9ea0865be59a7936\` FOREIGN KEY (\`appId\`) REFERENCES \`applications\`(\`appId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_ec4cf0c67c9ca5fa95075edc51f\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_23db2cf2e50f9130b5b5f7dcc28\` FOREIGN KEY (\`reviewedUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD CONSTRAINT \`FK_cef8d6e8edb69c82e5f10bb4026\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_8a347e1c1f8c61d7af35cd535d1\` FOREIGN KEY (\`receiverUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_a288164d612073c96cbeeb9075c\` FOREIGN KEY (\`appId\`) REFERENCES \`applications\`(\`appId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_3e901cbb9f32cffeb31425e1b87\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_a8bad6d5267a5c873dd1b026454\` FOREIGN KEY (\`reviewedUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_a8bad6d5267a5c873dd1b026454\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_3e901cbb9f32cffeb31425e1b87\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_a288164d612073c96cbeeb9075c\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_8a347e1c1f8c61d7af35cd535d1\``);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP FOREIGN KEY \`FK_cef8d6e8edb69c82e5f10bb4026\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_23db2cf2e50f9130b5b5f7dcc28\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_ec4cf0c67c9ca5fa95075edc51f\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_49793c0da7a9ea0865be59a7936\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_e237409a253d288b8e0427ad272\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_2923022ed48d26d1c4ebfc96af9\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP FOREIGN KEY \`FK_ae42ffbcadfe582ee41251bc405\``);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` DROP FOREIGN KEY \`FK_9b98119aba96b34da22716c2fb3\``);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` DROP FOREIGN KEY \`FK_d22e66c600c1b9f5faa052659bc\``);
        await queryRunner.query(`ALTER TABLE \`device_tokens\` DROP FOREIGN KEY \`FK_511957e3e8443429dc3fb00120c\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2868049bbe999cdf09aed764400\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_aaa8a6effc7bd20a1172d3a3bc8\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_0c484446b401e67b72f451faae6\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_f9de41aa1a29ad962263515d130\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_a27f901523ddfa2eaecb16a5976\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_ca3c84760fb37c2f14658a0a2ec\``);
        await queryRunner.query(`DROP INDEX \`IDX_6ce6acdb0801254590f8a78c08\` ON \`messages\``);
        await queryRunner.query(`DROP INDEX \`IDX_aaa8a6effc7bd20a1172d3a3bc\` ON \`messages\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`receiverUserId\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`deleteReceiver\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`deleteSender\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`readAt\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`contents\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP INDEX \`IDX_9743b3cec687ac55895f0d79ae\``);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`messageId\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`id\` \`messageId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`messageId\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`roomId\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`roomId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`content\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`messages\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD \`userUserId\` varchar(36) NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_6ce6acdb0801254590f8a78c08\` ON \`messages\` (\`createdAt\`)`);
    }

}
