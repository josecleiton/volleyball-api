import {MigrationInterface, QueryRunner} from "typeorm";

export class AlteraLigaEntity1653393427061 implements MigrationInterface {
    name = 'AlteraLigaEntity1653393427061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ligas" RENAME COLUMN "iniciada_em" TO "data_comeco"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ligas" RENAME COLUMN "data_comeco" TO "iniciada_em"`);
    }

}
