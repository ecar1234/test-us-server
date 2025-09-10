import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1757479336469 implements MigrationInterface {
    name = 'AutoGen1757479336469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NOT NULL, \`originalname\` varchar(255) NOT NULL, \`mimetype\` varchar(255) NOT NULL, \`size\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`Images\``);
    }

}
