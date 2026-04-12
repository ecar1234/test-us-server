import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1773388602784 implements MigrationInterface {
    name = 'AutoGen1773388602784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`purchase_event_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`eventType\` varchar(255) NOT NULL, \`appUserId\` varchar(255) NOT NULL, \`platform\` varchar(255) NOT NULL, \`payload\` json NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`purchases\` (\`id\` int NOT NULL AUTO_INCREMENT, \`productId\` varchar(255) NOT NULL, \`store\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`expiresAt\` datetime NULL, \`purchaseDate\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, UNIQUE INDEX \`REL_341f0dbe584866284359f30f3d\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD CONSTRAINT \`FK_341f0dbe584866284359f30f3da\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP FOREIGN KEY \`FK_341f0dbe584866284359f30f3da\``);
        await queryRunner.query(`DROP INDEX \`REL_341f0dbe584866284359f30f3d\` ON \`purchases\``);
        await queryRunner.query(`DROP TABLE \`purchases\``);
        await queryRunner.query(`DROP TABLE \`purchase_event_logs\``);
    }

}
