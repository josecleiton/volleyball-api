import {MigrationInterface, QueryRunner} from "typeorm";

export class PartidaAlteraTipagemTipoRodada1654450848783 implements MigrationInterface {
    name = 'PartidaAlteraTipagemTipoRodada1654450848783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c27fddfcd048b78de323b67dba"`);
        await queryRunner.query(`ALTER TABLE "partidas" DROP COLUMN "tipo_da_rodada"`);
        await queryRunner.query(`CREATE TYPE "public"."partidas_tipo_da_rodada_enum" AS ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', 'quartas', 'semis', 'final')`);
        await queryRunner.query(`ALTER TABLE "partidas" ADD "tipo_da_rodada" "public"."partidas_tipo_da_rodada_enum" NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_c27fddfcd048b78de323b67dba" ON "partidas" ("tipo_da_rodada") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_c27fddfcd048b78de323b67dba"`);
        await queryRunner.query(`ALTER TABLE "partidas" DROP COLUMN "tipo_da_rodada"`);
        await queryRunner.query(`DROP TYPE "public"."partidas_tipo_da_rodada_enum"`);
        await queryRunner.query(`ALTER TABLE "partidas" ADD "tipo_da_rodada" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_c27fddfcd048b78de323b67dba" ON "partidas" ("tipo_da_rodada") `);
    }

}
