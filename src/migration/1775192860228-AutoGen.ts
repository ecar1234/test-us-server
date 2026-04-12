import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1775192860228 implements MigrationInterface {
    name = 'AutoGen1775192860228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP FOREIGN KEY \`FK_341f0dbe584866284359f30f3da\``);
        await queryRunner.query(`DROP INDEX \`REL_341f0dbe584866284359f30f3d\` ON \`purchases\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`purchaseToken\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`receipt\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`verificationData\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`verificationData\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`receipt\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`purchaseToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`userId\` varchar(36) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_341f0dbe584866284359f30f3d\` ON \`purchases\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD CONSTRAINT \`FK_341f0dbe584866284359f30f3da\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
