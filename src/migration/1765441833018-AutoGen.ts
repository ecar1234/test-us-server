import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1765441833018 implements MigrationInterface {
    name = 'AutoGen1765441833018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`device_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`deviceType\` varchar(50) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` varchar(36) NULL, INDEX \`IDX_511957e3e8443429dc3fb00120\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`device_tokens\` ADD CONSTRAINT \`FK_511957e3e8443429dc3fb00120c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`device_tokens\` DROP FOREIGN KEY \`FK_511957e3e8443429dc3fb00120c\``);
        await queryRunner.query(`DROP INDEX \`IDX_511957e3e8443429dc3fb00120\` ON \`device_tokens\``);
        await queryRunner.query(`DROP TABLE \`device_tokens\``);
    }

}
