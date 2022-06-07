import { MigrationInterface, QueryRunner } from 'typeorm';

export class PontuacoesView1654569206139 implements MigrationInterface {
  name = 'PontuacoesView1654569206139';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'melhores_liberos_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "melhores_liberos_view"`);
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_5e275812a0861e5b9e56adf02fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_c7c95e31a3db527a6efdac0c345"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_6e9cc7455a900d190278156517c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_98b9592061b55759e443f83c8fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" DROP CONSTRAINT "FK_17be2ae28b3a1b637af04786246"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_98b9592061b55759e443f83c8f"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."atletas_escalados_posicao_enum" AS ENUM('ponta', 'oposto', 'central', 'libero', 'levantador')`,
    );
    await queryRunner.query(
      `CREATE TABLE "atletas_escalados" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "id_equipe_partida" uuid NOT NULL, "id_atleta" uuid NOT NULL, "posicao" "public"."atletas_escalados_posicao_enum" NOT NULL, CONSTRAINT "UQ_0ebb4fe31807a2fba26e6cfbe52" UNIQUE ("id_atleta", "id_equipe_partida"), CONSTRAINT "PK_27087bacfdaee173e8fda1bcdcc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f53daafa6e9d8554473d5b187a" ON "atletas_escalados" ("data_criacao") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aff09371e8b4aedd2d46ef1121" ON "atletas_escalados" ("id_equipe_partida") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f72a0deda9a05fa5079ebaf7d3" ON "atletas_escalados" ("id_atleta") `,
    );
    await queryRunner.query(`
          CREATE TABLE "equipes_partidas" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "data_atualizacao" timestamp NOT NULL DEFAULT now(),
            "data_criacao" timestamp NOT NULL DEFAULT now(),
            "id_equipe" uuid NOT NULL,
            "id_partida" uuid NOT NULL,
            "pontuacao" integer NOT NULL DEFAULT '0',
            "sets_ganhos" integer NOT NULL DEFAULT '0',
            "pontos_nos_sets" jsonb NOT NULL DEFAULT '[]',
            "sets_disputados" integer NOT NULL GENERATED ALWAYS AS (COALESCE(jsonb_array_length(pontos_nos_sets), 0)) STORED,
            "ganhou" smallint NOT NULL GENERATED ALWAYS AS (cast(pontuacao > 2 AS INTEGER)) STORED,
            "resultado_cadastrado_em" timestamp,
            "equipe_id" uuid,
            "partida_id" uuid,
            CONSTRAINT "PK_24349dada80e22369201346b0e9" PRIMARY KEY ("id")
          ) 
        `);
    await queryRunner.query(
      `CREATE INDEX "IDX_31f3de618c0b4fd37763676ee1" ON "equipes_partidas" ("data_criacao") `,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP COLUMN "id_equipe_ganhadora"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP COLUMN "id_equipe_visitante"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP COLUMN "id_equipe_mandante"`,
    );
    await queryRunner.query(`ALTER TABLE "partidas" ADD "id_ganhadora" uuid`);
    await queryRunner.query(
      `ALTER TABLE "arbitros_partida" DROP CONSTRAINT "FK_f2e52bb8b002c915b80af6bad60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "UQ_6e9cc7455a900d190278156517c"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2dcc30b378f8e69aedb263a046" ON "partidas" ("id_ganhadora") `,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas_escalados" ADD CONSTRAINT "FK_aff09371e8b4aedd2d46ef1121e" FOREIGN KEY ("id_equipe_partida") REFERENCES "equipes_partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas_escalados" ADD CONSTRAINT "FK_f72a0deda9a05fa5079ebaf7d3e" FOREIGN KEY ("id_atleta") REFERENCES "atletas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ADD CONSTRAINT "FK_7eea906559e9528e77df2d444d7" FOREIGN KEY ("equipe_id") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ADD CONSTRAINT "FK_cc63960c07dd47d83524974ef1e" FOREIGN KEY ("partida_id") REFERENCES "partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_2dcc30b378f8e69aedb263a0465" FOREIGN KEY ("id_ganhadora") REFERENCES "equipes_partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_55307682a97abeecbe78ef95e2b" FOREIGN KEY ("id_visitante") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_e343fae9dfdbb61550a5b7e26e7" FOREIGN KEY ("id_mandante") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros_partida" ADD CONSTRAINT "FK_f2e52bb8b002c915b80af6bad60" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" ADD CONSTRAINT "FK_17be2ae28b3a1b637af04786246" FOREIGN KEY ("id_atleta_partida") REFERENCES "atletas_escalados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`CREATE MATERIALIZED VIEW "pontuacoes_view" AS 
    SELECT
      e.id AS id_equipe,
      SUM(ep.pontuacao) AS pontuacao,
      SUM(ep.sets_ganhos) AS sets_ganhos,
      SUM(ep.sets_disputados) AS sets_disputados,
      COUNT(ep.id) AS partidas_disputadas,
      SUM(ep.ganhou) AS partidas_ganhas,
      SUM(ep.sets_disputados) - SUM(ep.sets_ganhos) AS sets_perdidos,
      COUNT(ep.id) - SUM(ep.ganhou) AS partidas_perdidas
    FROM equipes_partidas AS ep
    INNER JOIN equipes AS e
      ON e.id = ep.id_equipe
    GROUP BY e.id
    ORDER BY pontuacao DESC
  `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_pontuacoes_view_id_equipe" ON "pontuacoes_view" ("id_equipe")`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'pontuacoes_view',
        'SELECT\n      e.id AS id_equipe,\n      SUM(ep.pontuacao) AS pontuacao,\n      SUM(ep.sets_ganhos) AS sets_ganhos,\n      SUM(ep.sets_disputados) AS sets_disputados,\n      COUNT(ep.id) AS partidas_disputadas,\n      SUM(ep.ganhou) AS partidas_ganhas,\n      SUM(ep.sets_disputados) - SUM(ep.sets_ganhos) AS sets_perdidos,\n      COUNT(ep.id) - SUM(ep.ganhou) AS partidas_perdidas\n    FROM equipes_partidas AS ep\n    INNER JOIN equipes AS e\n      ON e.id = ep.id_equipe\n    GROUP BY e.id\n    ORDER BY pontuacao DESC',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'pontuacoes_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "pontuacoes_view"`);
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" DROP CONSTRAINT "FK_17be2ae28b3a1b637af04786246"`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros_partida" DROP CONSTRAINT "FK_f2e52bb8b002c915b80af6bad60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_e343fae9dfdbb61550a5b7e26e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_55307682a97abeecbe78ef95e2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_2dcc30b378f8e69aedb263a0465"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" DROP CONSTRAINT "FK_cc63960c07dd47d83524974ef1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" DROP CONSTRAINT "FK_7eea906559e9528e77df2d444d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas_escalados" DROP CONSTRAINT "FK_f72a0deda9a05fa5079ebaf7d3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas_escalados" DROP CONSTRAINT "FK_aff09371e8b4aedd2d46ef1121e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2dcc30b378f8e69aedb263a046"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "UQ_6e9cc7455a900d190278156517c" UNIQUE ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros_partida" ADD CONSTRAINT "FK_f2e52bb8b002c915b80af6bad60" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP COLUMN "id_ganhadora"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD "id_equipe_mandante" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD "id_equipe_visitante" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD "id_equipe_ganhadora" uuid`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_31f3de618c0b4fd37763676ee1"`,
    );
    await queryRunner.query(`DROP TABLE "equipes_partidas"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f72a0deda9a05fa5079ebaf7d3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_aff09371e8b4aedd2d46ef1121"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f53daafa6e9d8554473d5b187a"`,
    );
    await queryRunner.query(`DROP TABLE "atletas_escalados"`);
    await queryRunner.query(
      `DROP TYPE "public"."atletas_escalados_posicao_enum"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_98b9592061b55759e443f83c8f" ON "partidas" ("id_equipe_ganhadora") `,
    );
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" ADD CONSTRAINT "FK_17be2ae28b3a1b637af04786246" FOREIGN KEY ("id_atleta_partida") REFERENCES "atletas_partida"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_98b9592061b55759e443f83c8fb" FOREIGN KEY ("id_equipe_ganhadora") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_6e9cc7455a900d190278156517c" FOREIGN KEY ("id") REFERENCES "pontuacoes_partida"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_c7c95e31a3db527a6efdac0c345" FOREIGN KEY ("id_equipe_mandante") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_5e275812a0861e5b9e56adf02fc" FOREIGN KEY ("id_equipe_visitante") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
