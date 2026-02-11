import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1764742317585 implements MigrationInterface {
    name = 'AutoGen1764742317585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2868049bbe999cdf09aed764400\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_8a347e1c1f8c61d7af35cd535d1\``);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` DROP FOREIGN KEY \`FK_d22e66c600c1b9f5faa052659bc\``);
        await queryRunner.query(`DROP INDEX \`IDX_a0f06a2598032b44cd96e3a26b\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`FK_ae42ffbcadfe582ee41251bc405\` ON \`base_post_entity\``);
        await queryRunner.query(`DROP INDEX \`FK_e237409a253d288b8e0427ad272\` ON \`applications\``);
        await queryRunner.query(`DROP INDEX \`FK_23db2cf2e50f9130b5b5f7dcc28\` ON \`user_reviews\``);
        await queryRunner.query(`DROP INDEX \`FK_ec4cf0c67c9ca5fa95075edc51f\` ON \`user_reviews\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_2ade55fa1ac34cb086a73998b9\` ON \`users\` (\`email\`, \`nickname\`)`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2868049bbe999cdf09aed764400\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_8a347e1c1f8c61d7af35cd535d1\` FOREIGN KEY (\`receiverUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` ADD CONSTRAINT \`FK_d22e66c600c1b9f5faa052659bc\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` ADD CONSTRAINT \`FK_ae42ffbcadfe582ee41251bc405\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`applications\` ADD CONSTRAINT \`FK_e237409a253d288b8e0427ad272\` FOREIGN KEY (\`appUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_ec4cf0c67c9ca5fa95075edc51f\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` ADD CONSTRAINT \`FK_23db2cf2e50f9130b5b5f7dcc28\` FOREIGN KEY (\`reviewedUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_23db2cf2e50f9130b5b5f7dcc28\``);
        await queryRunner.query(`ALTER TABLE \`user_reviews\` DROP FOREIGN KEY \`FK_ec4cf0c67c9ca5fa95075edc51f\``);
        await queryRunner.query(`ALTER TABLE \`applications\` DROP FOREIGN KEY \`FK_e237409a253d288b8e0427ad272\``);
        await queryRunner.query(`ALTER TABLE \`base_post_entity\` DROP FOREIGN KEY \`FK_ae42ffbcadfe582ee41251bc405\``);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` DROP FOREIGN KEY \`FK_d22e66c600c1b9f5faa052659bc\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_8a347e1c1f8c61d7af35cd535d1\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2868049bbe999cdf09aed764400\``);
        await queryRunner.query(`DROP INDEX \`IDX_2ade55fa1ac34cb086a73998b9\` ON \`users\``);
        await queryRunner.query(`CREATE INDEX \`FK_ec4cf0c67c9ca5fa95075edc51f\` ON \`user_reviews\` (\`reviewerUserId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_23db2cf2e50f9130b5b5f7dcc28\` ON \`user_reviews\` (\`reviewedUserId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_e237409a253d288b8e0427ad272\` ON \`applications\` (\`appUserId\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_ae42ffbcadfe582ee41251bc405\` ON \`base_post_entity\` (\`authorId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_a0f06a2598032b44cd96e3a26b\` ON \`users\` (\`email\`, \`nickname\`)`);
        await queryRunner.query(`ALTER TABLE \`post_reviews\` ADD CONSTRAINT \`FK_d22e66c600c1b9f5faa052659bc\` FOREIGN KEY (\`reviewerUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_8a347e1c1f8c61d7af35cd535d1\` FOREIGN KEY (\`receiverUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2868049bbe999cdf09aed764400\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`User\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
