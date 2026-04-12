import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1775542714835 implements MigrationInterface {
    name = 'AutoGen1775542714835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD \`userId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD CONSTRAINT \`FK_341f0dbe584866284359f30f3da\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP FOREIGN KEY \`FK_341f0dbe584866284359f30f3da\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP COLUMN \`userId\``);
    }

}
