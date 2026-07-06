import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoGen1783332758226 implements MigrationInterface {
    name = 'AutoGen1783332758226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD UNIQUE INDEX \`IDX_7781b8ef95e9d9f742bb7d00f5\` (\`transactionId\`)`);
        await queryRunner.query(`ALTER TABLE \`purchases\` ADD UNIQUE INDEX \`IDX_242ac577cf6109f1725dc14348\` (\`purchaseToken\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_fadb0613d9d1d67f9bffcb2a9a\` ON \`purchases\` (\`originalTransactionsId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_fadb0613d9d1d67f9bffcb2a9a\` ON \`purchases\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP INDEX \`IDX_242ac577cf6109f1725dc14348\``);
        await queryRunner.query(`ALTER TABLE \`purchases\` DROP INDEX \`IDX_7781b8ef95e9d9f742bb7d00f5\``);
    }

}
