import {MigrationInterface, QueryRunner} from "typeorm";

export class EstadoLiga1654349284480 implements MigrationInterface {
    name = 'EstadoLiga1654349284480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ligas_estado_enum" AS ENUM('criada', 'classificatória', 'quartas', 'semis', 'finais', 'premiacao', 'concluida')`);
        await queryRunner.query(`ALTER TABLE "ligas" ADD "estado" "public"."ligas_estado_enum" NOT NULL DEFAULT 'criada'`);
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" DROP CONSTRAINT "FK_84e687cbbe490a5ffd7926ca85a"`);
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" ADD CONSTRAINT "UQ_84e687cbbe490a5ffd7926ca85a" UNIQUE ("id")`);
        await queryRunner.query(`CREATE INDEX "IDX_c27fddfcd048b78de323b67dba" ON "partidas" ("tipo_da_rodada") `);
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" ADD CONSTRAINT "FK_84e687cbbe490a5ffd7926ca85a" FOREIGN KEY ("id") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" DROP CONSTRAINT "FK_84e687cbbe490a5ffd7926ca85a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c27fddfcd048b78de323b67dba"`);
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" DROP CONSTRAINT "UQ_84e687cbbe490a5ffd7926ca85a"`);
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" ADD CONSTRAINT "FK_84e687cbbe490a5ffd7926ca85a" FOREIGN KEY ("id") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ligas" DROP COLUMN "estado"`);
        await queryRunner.query(`DROP TYPE "public"."ligas_estado_enum"`);
    }

}
