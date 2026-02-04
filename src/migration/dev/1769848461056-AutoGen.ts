import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1769848461056 implements MigrationInterface {
    name = 'AutoGen1769848461056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_bb5e44cc2aa1d12e23f267dd51d\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_18832b4828b9b929257cb6d50c5\``);
        await queryRunner.query(`DROP INDEX \`REL_18832b4828b9b929257cb6d50c\` ON \`rooms\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` CHANGE \`lastMessageId\` \`last_message_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP COLUMN \`userUserId\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD UNIQUE INDEX \`IDX_0c484446b401e67b72f451faae\` (\`last_message_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_0c484446b401e67b72f451faae\` ON \`rooms\` (\`last_message_id\`)`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_ca3c84760fb37c2f14658a0a2ec\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_0c484446b401e67b72f451faae6\` FOREIGN KEY (\`last_message_id\`) REFERENCES \`messages\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_0c484446b401e67b72f451faae6\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_ca3c84760fb37c2f14658a0a2ec\``);
        await queryRunner.query(`DROP INDEX \`REL_0c484446b401e67b72f451faae\` ON \`rooms\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP INDEX \`IDX_0c484446b401e67b72f451faae\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD \`userUserId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`rooms\` CHANGE \`last_message_id\` \`lastMessageId\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_18832b4828b9b929257cb6d50c\` ON \`rooms\` (\`lastMessageId\`)`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_18832b4828b9b929257cb6d50c5\` FOREIGN KEY (\`lastMessageId\`) REFERENCES \`messages\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_bb5e44cc2aa1d12e23f267dd51d\` FOREIGN KEY (\`userUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
