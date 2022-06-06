import {MigrationInterface, QueryRunner} from "typeorm";

export class CriaFundamentoAtletaEIndicePartidaStatus1654524370115 implements MigrationInterface {
    name = 'CriaFundamentoAtletaEIndicePartidaStatus1654524370115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fundamentos_atletas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "id_atleta_partida" uuid NOT NULL, "bloqueios" integer NOT NULL DEFAULT '0', "recepcoes" integer NOT NULL DEFAULT '0', "aces" integer NOT NULL DEFAULT '0', "saques" integer NOT NULL DEFAULT '0', "ataques" integer NOT NULL DEFAULT '0', "pontos" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_67211888fdbc91d8bc3e3496d98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e45b4e2013928b50f0cb7bab0f" ON "fundamentos_atletas" ("data_criacao") `);
        await queryRunner.query(`CREATE INDEX "IDX_17be2ae28b3a1b637af0478624" ON "fundamentos_atletas" ("id_atleta_partida") `);
        await queryRunner.query(`CREATE INDEX "IX_partidas_status_tipoDaRodada" ON "partidas" ("status", "tipo_da_rodada") `);
        await queryRunner.query(`ALTER TABLE "fundamentos_atletas" ADD CONSTRAINT "FK_17be2ae28b3a1b637af04786246" FOREIGN KEY ("id_atleta_partida") REFERENCES "atletas_partida"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fundamentos_atletas" DROP CONSTRAINT "FK_17be2ae28b3a1b637af04786246"`);
        await queryRunner.query(`DROP INDEX "public"."IX_partidas_status_tipoDaRodada"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_17be2ae28b3a1b637af0478624"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e45b4e2013928b50f0cb7bab0f"`);
        await queryRunner.query(`DROP TABLE "fundamentos_atletas"`);
    }

}
