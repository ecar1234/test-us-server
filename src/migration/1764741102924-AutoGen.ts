import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1764741102924 implements MigrationInterface {
    name = 'AutoGen1764741102924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_0d07ae311ec0554a3f9ad8011a2\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_778a3ad424798e5bbdca6f1f484\``);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` DROP FOREIGN KEY \`FK_d22e66c600c1b9f5faa052659bc\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_6b9bce3de357b4161cbcd844ca6\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_b9f2941c3f2cb100ef280530e95\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_13ff2ef1a6a1280b5a56df28c9b\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_3e901cbb9f32cffeb31425e1b87\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_a288164d612073c96cbeeb9075c\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_a8bad6d5267a5c873dd1b026454\``);
        await queryRunner.query(`DROP INDEX \`IDX_cdff51074d5feaa3b9849cb827\` ON \`messages\``);
        await queryRunner.query(`DROP INDEX \`FK_ae42ffbcadfe582ee41251bc405\` ON \`base_post_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_cba5fa33d48553d7ad0a40f938\` ON \`applications\``);
        await queryRunner.query(`DROP INDEX \`IDX_4f0a34566e56fc16f403df3157\` ON \`user_reviews\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP COLUMN \`reviewType\``);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD UNIQUE INDEX \`IDX_9743b3cec687ac55895f0d79ae\` (\`messageId\`)`);
        await queryRunner.query(`ALTER TABLE \`applications\` CHANGE \`platform\` \`platform\` enum ('web', 'ios', 'android') NOT NULL DEFAULT 'web'`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_d51862c2ad05bed194af31f648\` ON \`post_reviews\` (\`reviewerUserId\`, \`postId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_6c9d89b4ef4ce7fd39e9e28a37\` ON \`applications\` (\`postId\`, \`appUserId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_b7fd00599434d50a1699df23fd\` ON \`user_reviews\` (\`appId\`, \`reviewerUserId\`, \`reviewedUserId\`)`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2868049bbe999cdf09aed764400\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_8a347e1c1f8c61d7af35cd535d1\` FOREIGN KEY (\`receiverUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` ADD CONSTRAINT \`FK_d22e66c600c1b9f5faa052659bc\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD CONSTRAINT \`FK_ae42ffbcadfe582ee41251bc405\` FOREIGN KEY (\`authorId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_2923022ed48d26d1c4ebfc96af9\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_e237409a253d288b8e0427ad272\` FOREIGN KEY (\`appUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_49793c0da7a9ea0865be59a7936\` FOREIGN KEY (\`appId\`) REFERENCES \`applications\`(\`appId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_ec4cf0c67c9ca5fa95075edc51f\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_23db2cf2e50f9130b5b5f7dcc28\` FOREIGN KEY (\`reviewedUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_d0b58512094e126fa5b0b484ae0\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_d0b58512094e126fa5b0b484ae0\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_23db2cf2e50f9130b5b5f7dcc28\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_ec4cf0c67c9ca5fa95075edc51f\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_49793c0da7a9ea0865be59a7936\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_e237409a253d288b8e0427ad272\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_2923022ed48d26d1c4ebfc96af9\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP FOREIGN KEY \`FK_ae42ffbcadfe582ee41251bc405\``);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` DROP FOREIGN KEY \`FK_d22e66c600c1b9f5faa052659bc\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_8a347e1c1f8c61d7af35cd535d1\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2868049bbe999cdf09aed764400\``);
        await queryRunner.query(`DROP INDEX \`IDX_b7fd00599434d50a1699df23fd\` ON \`user_reviews\``);
        await queryRunner.query(`DROP INDEX \`IDX_6c9d89b4ef4ce7fd39e9e28a37\` ON \`applications\``);
        await queryRunner.query(`DROP INDEX \`IDX_d51862c2ad05bed194af31f648\` ON \`post_reviews\``);
        await queryRunner.query(`ALTER TABLE \`applications\` CHANGE \`platform\` \`platform\` enum ('web', 'ios', 'android', 'game') NOT NULL DEFAULT 'web'`);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP INDEX \`IDX_9743b3cec687ac55895f0d79ae\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD \`reviewType\` enum ('PRODUCT_RATING', 'PARTICIPANT_ATTITUDE_RATING') NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4f0a34566e56fc16f403df3157\` ON \`user_reviews\` (\`appId\`, \`reviewerUserId\`, \`reviewedUserId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_cba5fa33d48553d7ad0a40f938\` ON \`applications\` (\`postId\`, \`appUserId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_ae42ffbcadfe582ee41251bc405\` ON \`base_post_entity\` (\`authorId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_cdff51074d5feaa3b9849cb827\` ON \`messages\` (\`messageId\`)`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_a8bad6d5267a5c873dd1b026454\` FOREIGN KEY (\`reviewedUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_a288164d612073c96cbeeb9075c\` FOREIGN KEY (\`appId\`) REFERENCES \`applications\`(\`appId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_3e901cbb9f32cffeb31425e1b87\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_13ff2ef1a6a1280b5a56df28c9b\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_b9f2941c3f2cb100ef280530e95\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_6b9bce3de357b4161cbcd844ca6\` FOREIGN KEY (\`appUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` ADD CONSTRAINT \`FK_d22e66c600c1b9f5faa052659bc\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_778a3ad424798e5bbdca6f1f484\` FOREIGN KEY (\`receiverUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_0d07ae311ec0554a3f9ad8011a2\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
