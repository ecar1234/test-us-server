import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1754121006403 implements MigrationInterface {
    name = 'AutoGen1754121006403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Messages\` ADD \`deleteSender\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`Messages\` ADD \`deleteReceiver\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`Messages\` ADD UNIQUE INDEX \`IDX_cdff51074d5feaa3b9849cb827\` (\`messageId\`)`);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_3e901cbb9f32cffeb31425e1b87\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_a8bad6d5267a5c873dd1b026454\``);
        await queryRunner.query(`ALTER TABLE \`Application\` DROP FOREIGN KEY \`FK_6b9bce3de357b4161cbcd844ca6\``);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP FOREIGN KEY \`FK_cef8d6e8edb69c82e5f10bb4026\``);
        await queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_0d07ae311ec0554a3f9ad8011a2\``);
        await queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_778a3ad424798e5bbdca6f1f484\``);
        await queryRunner.query(`ALTER TABLE \`User\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`User\` ADD \`userId\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_3e901cbb9f32cffeb31425e1b87\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_a8bad6d5267a5c873dd1b026454\` FOREIGN KEY (\`reviewedUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Application\` ADD CONSTRAINT \`FK_6b9bce3de357b4161cbcd844ca6\` FOREIGN KEY (\`appUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD CONSTRAINT \`FK_cef8d6e8edb69c82e5f10bb4026\` FOREIGN KEY (\`authorId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_0d07ae311ec0554a3f9ad8011a2\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_778a3ad424798e5bbdca6f1f484\` FOREIGN KEY (\`receiverUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_778a3ad424798e5bbdca6f1f484\``);
        await queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_0d07ae311ec0554a3f9ad8011a2\``);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP FOREIGN KEY \`FK_cef8d6e8edb69c82e5f10bb4026\``);
        await queryRunner.query(`ALTER TABLE \`Application\` DROP FOREIGN KEY \`FK_6b9bce3de357b4161cbcd844ca6\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_a8bad6d5267a5c873dd1b026454\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_3e901cbb9f32cffeb31425e1b87\``);
        await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`User\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`User\` ADD PRIMARY KEY (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_778a3ad424798e5bbdca6f1f484\` FOREIGN KEY (\`receiverUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_0d07ae311ec0554a3f9ad8011a2\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD CONSTRAINT \`FK_cef8d6e8edb69c82e5f10bb4026\` FOREIGN KEY (\`authorId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Application\` ADD CONSTRAINT \`FK_6b9bce3de357b4161cbcd844ca6\` FOREIGN KEY (\`appUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_a8bad6d5267a5c873dd1b026454\` FOREIGN KEY (\`reviewedUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_3e901cbb9f32cffeb31425e1b87\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Messages\` DROP INDEX \`IDX_cdff51074d5feaa3b9849cb827\``);
        await queryRunner.query(`ALTER TABLE \`Messages\` DROP COLUMN \`deleteReceiver\``);
        await queryRunner.query(`ALTER TABLE \`Messages\` DROP COLUMN \`deleteSender\``);
    }

}
