import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1776416487682 implements MigrationInterface {
    name = 'AutoGen1776416487682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post_reviews\` DROP FOREIGN KEY \`FK_9b98119aba96b34da22716c2fb3\``);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` DROP FOREIGN KEY \`FK_d22e66c600c1b9f5faa052659bc\``);
        await queryRunner.query(`ALTER TABLE \`device_tokens\` DROP FOREIGN KEY \`FK_511957e3e8443429dc3fb00120c\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`verificationData\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`transactionId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`originalTransactionsId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`rootId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`purchaseToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`linkedPurchaseToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` CHANGE \`state\` \`state\` enum ('purchased', 'canceled', 'expired', 'renew', 'refund') NOT NULL DEFAULT 'purchased'`);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`expiresAt\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`expiresAt\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP COLUMN \`lastMessageAt\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD \`lastMessageAt\` timestamp NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_26138e638bdd8825e36d01d898\` ON \`purchases\` (\`store\`)`);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` ADD CONSTRAINT \`FK_d22e66c600c1b9f5faa052659bc\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` ADD CONSTRAINT \`FK_9b98119aba96b34da22716c2fb3\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`device_tokens\` ADD CONSTRAINT \`FK_511957e3e8443429dc3fb00120c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device_tokens\` DROP FOREIGN KEY \`FK_511957e3e8443429dc3fb00120c\``);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` DROP FOREIGN KEY \`FK_9b98119aba96b34da22716c2fb3\``);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` DROP FOREIGN KEY \`FK_d22e66c600c1b9f5faa052659bc\``);
        await queryRunner.query(`DROP INDEX \`IDX_26138e638bdd8825e36d01d898\` ON \`purchases\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP COLUMN \`lastMessageAt\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD \`lastMessageAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`expiresAt\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`expiresAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` CHANGE \`state\` \`state\` enum ('purchased', 'canceled', 'expired', 'renew') NOT NULL DEFAULT 'purchased'`);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`linkedPurchaseToken\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`purchaseToken\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`rootId\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`originalTransactionsId\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`transactionId\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`verificationData\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`device_tokens\` ADD CONSTRAINT \`FK_511957e3e8443429dc3fb00120c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` ADD CONSTRAINT \`FK_d22e66c600c1b9f5faa052659bc\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` ADD CONSTRAINT \`FK_9b98119aba96b34da22716c2fb3\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
