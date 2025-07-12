import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1752113022689 implements MigrationInterface {
    name = 'AutoGen1752113022689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`User\` (\`user_id\` varchar(255) NOT NULL, \`user_naem\` varchar(255) NOT NULL, \`email\` varchar(50) NOT NULL, \`password_hash\` varchar(20) NOT NULL, \`create_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4a257d2c9837248d70640b3e36\` (\`email\`), PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_23ce04cfab9da83da55fa517c95\` FOREIGN KEY (\`application_id\`) REFERENCES \`Application\`(\`app_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_c1b275755e63a3992cf70f94c38\` FOREIGN KEY (\`reviewer_user_id\`) REFERENCES \`User\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Review\` ADD CONSTRAINT \`FK_e2261b15b79e4cf2d687940bb52\` FOREIGN KEY (\`reviewed_user_id\`) REFERENCES \`User\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Application\` ADD CONSTRAINT \`FK_fedaf052d7aff9bf9c12dab5950\` FOREIGN KEY (\`post_id\`) REFERENCES \`Post\`(\`post_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Application\` ADD CONSTRAINT \`FK_d2eca6b675b5b78a2ae530f46cf\` FOREIGN KEY (\`app_user_id\`) REFERENCES \`User\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Post\` ADD CONSTRAINT \`FK_8b688f2d8d7161ed1be09d452e3\` FOREIGN KEY (\`author_user_id\`) REFERENCES \`User\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_851fd337e3b8f18448c96544135\` FOREIGN KEY (\`sender_user_id\`) REFERENCES \`User\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_682f6b9b5bab90feaa70fe97381\` FOREIGN KEY (\`receiver_user_id\`) REFERENCES \`User\`(\`user_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_682f6b9b5bab90feaa70fe97381\``);
        await queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_851fd337e3b8f18448c96544135\``);
        await queryRunner.query(`ALTER TABLE \`Post\` DROP FOREIGN KEY \`FK_8b688f2d8d7161ed1be09d452e3\``);
        await queryRunner.query(`ALTER TABLE \`Application\` DROP FOREIGN KEY \`FK_d2eca6b675b5b78a2ae530f46cf\``);
        await queryRunner.query(`ALTER TABLE \`Application\` DROP FOREIGN KEY \`FK_fedaf052d7aff9bf9c12dab5950\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_e2261b15b79e4cf2d687940bb52\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_c1b275755e63a3992cf70f94c38\``);
        await queryRunner.query(`ALTER TABLE \`Review\` DROP FOREIGN KEY \`FK_23ce04cfab9da83da55fa517c95\``);
        await queryRunner.query(`DROP INDEX \`IDX_4a257d2c9837248d70640b3e36\` ON \`User\``);
        await queryRunner.query(`DROP TABLE \`User\``);
    }

}
