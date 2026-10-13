import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1791896678696 implements MigrationInterface {
    name = 'AutoGen1791896678696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. 기존 외래키(Foreign Key) 제약조건들을 먼저 안전하게 삭제
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP FOREIGN KEY \`FK_341f0dbe584866284359f30f3da\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2868049bbe999cdf09aed764400\``);
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_f9de41aa1a29ad962263515d130\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_ca3c84760fb37c2f14658a0a2ec\``);

        // 2. purchases 오타 컬럼명 먼저 변경 (인덱스를 생성하기 전에 컬럼이 존재해야 함)
        await queryRunner.query(`ALTER TABLE \`purchases\` CHANGE \`originalTransactionsId\` \`originalTransactionId\` varchar(255) NULL`);

        // 3. purchases 신규 인덱스 생성
        await queryRunner.query(`CREATE INDEX \`IDX_b1dcca00e8c46ea91976e2de42\` ON \`purchases\` (\`originalTransactionId\`)`);

        // 4. room_members의 roomId 인덱스를 먼저 생성 (MySQL FK 지탱용)
        await queryRunner.query(`CREATE INDEX \`IDX_a27f901523ddfa2eaecb16a597\` ON \`room_members\` (\`roomId\`)`);

        // 5. room_members 기존 복합 인덱스 삭제 및 userId 컬럼 재정의 (varchar 36)
        await queryRunner.query(`DROP INDEX \`IDX_151cb61c3e462093aa3b8e70f7\` ON \`room_members\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD \`userId\` varchar(36) NULL`);

        // 6. room_members 신규 복합 유니크 인덱스 생성
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_151cb61c3e462093aa3b8e70f7\` ON \`room_members\` (\`roomId\`, \`userId\`)`);

        // 7. 새로운 외래키 제약조건 연결 (onDelete 정책 반영)
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD CONSTRAINT \`FK_341f0dbe584866284359f30f3da\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_ca3c84760fb37c2f14658a0a2ec\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2868049bbe999cdf09aed764400\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_f9de41aa1a29ad962263515d130\` FOREIGN KEY (\`postPostId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`rooms\` DROP FOREIGN KEY \`FK_f9de41aa1a29ad962263515d130\``);
        await queryRunner.query(`ALTER TABLE \`messages\` DROP FOREIGN KEY \`FK_2868049bbe999cdf09aed764400\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP FOREIGN KEY \`FK_ca3c84760fb37c2f14658a0a2ec\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP FOREIGN KEY \`FK_341f0dbe584866284359f30f3da\``);
        await queryRunner.query(`DROP INDEX \`IDX_151cb61c3e462093aa3b8e70f7\` ON \`room_members\``);
        await queryRunner.query(`DROP INDEX \`IDX_a27f901523ddfa2eaecb16a597\` ON \`room_members\``);
        await queryRunner.query(`DROP INDEX \`IDX_b1dcca00e8c46ea91976e2de42\` ON \`purchases\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`purchases\` CHANGE \`originalTransactionId\` \`originalTransactionsId\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_151cb61c3e462093aa3b8e70f7\` ON \`room_members\` (\`roomId\`, \`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`rooms\` ADD CONSTRAINT \`FK_f9de41aa1a29ad962263515d130\` FOREIGN KEY (\`postPostId\`) REFERENCES \`base_post_entity\`(\`postId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`messages\` ADD CONSTRAINT \`FK_2868049bbe999cdf09aed764400\` FOREIGN KEY (\`senderUserId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`room_members\` ADD CONSTRAINT \`FK_ca3c84760fb37c2f14658a0a2ec\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD CONSTRAINT \`FK_341f0dbe584866284359f30f3da\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
