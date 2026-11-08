import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1794152504325 implements MigrationInterface {
    name = 'AutoGen1794152504325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_2923022ed48d26d1c4ebfc96af9\``);
        await queryRunner.query(`DROP INDEX \`IDX_6c9d89b4ef4ce7fd39e9e28a37\` ON \`applications\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`postId\``);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`recruitPostId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`sidePostId\` varchar(36) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`UQ_SIDE_APPLICANT\` ON \`applications\` (\`sidePostId\`, \`appUserId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`UQ_RECRUIT_APPLICANT\` ON \`applications\` (\`recruitPostId\`, \`appUserId\`)`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_13cbbc53cae2bb728170942bde5\` FOREIGN KEY (\`recruitPostId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_1ef590a82c5a6d200edfbdc119d\` FOREIGN KEY (\`sidePostId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_1ef590a82c5a6d200edfbdc119d\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_13cbbc53cae2bb728170942bde5\``);
        await queryRunner.query(`DROP INDEX \`UQ_RECRUIT_APPLICANT\` ON \`applications\``);
        await queryRunner.query(`DROP INDEX \`UQ_SIDE_APPLICANT\` ON \`applications\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`sidePostId\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP COLUMN \`recruitPostId\``);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD \`postId\` varchar(36) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_6c9d89b4ef4ce7fd39e9e28a37\` ON \`applications\` (\`postId\`, \`appUserId\`)`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_2923022ed48d26d1c4ebfc96af9\` FOREIGN KEY (\`postId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
