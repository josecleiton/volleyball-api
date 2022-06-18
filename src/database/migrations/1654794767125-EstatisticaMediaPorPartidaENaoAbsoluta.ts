import { MigrationInterface, QueryRunner } from 'typeorm';

export class EstatisticaMediaPorPartidaENaoAbsoluta1654794767125
  implements MigrationInterface
{
  name = 'EstatisticaMediaPorPartidaENaoAbsoluta1654794767125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'melhores_liberos_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "melhores_liberos_view"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'melhores_centrais_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "melhores_centrais_view"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'pontuacoes_view', 'public'],
    );
    await queryRunner.query(`CREATE MATERIALIZED VIEW "melhores_centrais_view" AS 
    WITH ac AS (
      SELECT
        a.id AS id,
        COUNT(f.id) AS qtd,
        SUM(f.bloqueios) AS total
      FROM fundamentos_atletas AS f
      INNER JOIN atletas_escalados AS ae
      ON
        ae.id = f.id_atleta_escalado
        AND ae.posicao = 'central'
      INNER JOIN atletas AS a
      ON
        a.id = ae.id_atleta
      GROUP BY a.id
    )

    SELECT
      ac.id AS id_atleta,
      ac.qtd AS quantidade_partidas,
      COALESCE(ac.total / NULLIF(ac.qtd, 0), 0) AS bloqueios_por_partida
    FROM ac
  `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_melhores_centrais_view_idAtleta" ON "melhores_centrais_view" ("id_atleta")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_melhores_centrais_view_media" ON "melhores_centrais_view" ("quantidade_partidas" DESC, "bloqueios_por_partida" DESC)`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'melhores_centrais_view',
        "WITH ac AS (\n      SELECT\n        a.id AS id,\n        COUNT(f.id) AS qtd,\n        SUM(f.bloqueios) AS total\n      FROM fundamentos_atletas AS f\n      INNER JOIN atletas_escalados AS ae\n      ON\n        ae.id = f.id_atleta_escalado\n        AND ae.posicao = 'central'\n      GROUP BY a.id\n    )\n\n    SELECT\n      ac.id AS id_atleta,\n      ac.qtd AS quantidade_partidas,\n      COALESCE(ac.total / NULLIF(ac.qtd, 0), 0) AS bloqueios_por_partida\n    FROM ac",
      ],
    );
    await queryRunner.query(`CREATE MATERIALIZED VIEW "melhores_liberos_view" AS 
    WITH ac AS (
      SELECT
        a.id AS id,
        COUNT(f.id) AS qtd,
        SUM(f.recepcoes) AS total
      FROM fundamentos_atletas AS f
      INNER JOIN atletas_escalados AS ae
      ON
        ae.id = f.id_atleta_escalado
        AND ae.posicao = 'libero'
      INNER JOIN atletas AS a
      ON
        a.id = ae.id_atleta
      GROUP BY a.id
    )

    SELECT
      ac.id AS id_atleta,
      ac.qtd AS quantidade_partidas,
      COALESCE(ac.total / NULLIF(ac.qtd, 0), 0) AS recepcoes_por_partida
    FROM ac
`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_melhores_liberos_view_idAtleta" ON "melhores_liberos_view" ("id_atleta")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_melhores_liberos_view_media" ON "melhores_liberos_view" ("quantidade_partidas" DESC, "recepcoes_por_partida" DESC)`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'melhores_liberos_view',
        "WITH ac AS (\n      SELECT\n        a.id AS id,\n        COUNT(f.id) AS qtd,\n        SUM(f.recepcoes) AS total\n      FROM fundamentos_atletas AS f\n      INNER JOIN atletas_escalados AS ae\n      ON\n        ae.id = f.id_atleta_escalado\n        AND ae.posicao = 'libero'\n      GROUP BY a.id\n    )\n\n    SELECT\n      ac.id AS id_atleta,\n      ac.qtd AS quantidade_partidas,\n      COALESCE(ac.total / NULLIF(ac.qtd, 0), 0) AS recepcoes_por_partida\n    FROM ac",
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'melhores_liberos_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "melhores_liberos_view"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'melhores_centrais_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "melhores_centrais_view"`);
    await queryRunner.query(
      `CREATE MATERIALIZED VIEW "melhores_centrais_view" AS SELECT "a"."id" AS "id_atleta", COALESCE(SUM("f"."bloqueios"), 0) AS "bloqueios" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_escalados" "ae" ON "ae"."id"="f"."id_atleta_escalado" AND ("ae"."id" = "f"."id_atleta_escalado" AND "ae"."posicao" = 'central')  INNER JOIN "atletas" "a" ON "a"."id"="ae"."id_atleta" GROUP BY "a"."id" ORDER BY bloqueios DESC`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'melhores_centrais_view',
        'SELECT "a"."id" AS "id_atleta", COALESCE(SUM("f"."bloqueios"), 0) AS "bloqueios" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_escalados" "ae" ON "ae"."id"="f"."id_atleta_escalado" AND ("ae"."id" = "f"."id_atleta_escalado" AND "ae"."posicao" = \'central\')  INNER JOIN "atletas" "a" ON "a"."id"="ae"."id_atleta" GROUP BY "a"."id" ORDER BY bloqueios DESC',
      ],
    );
    await queryRunner.query(
      `CREATE MATERIALIZED VIEW "melhores_liberos_view" AS SELECT "a"."id" AS "id_atleta", coalesce(sum("f"."recepcoes"), 0) AS "recepcoes" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_escalados" "ae" ON "ae"."id"="f"."id_atleta_escalado" AND ("ae"."id" = "f"."id_atleta_escalado" AND "ae"."posicao" = 'libero')  INNER JOIN "atletas" "a" ON "a"."id"="ae"."id_atleta" GROUP BY "a"."id" ORDER BY recepcoes DESC`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'melhores_liberos_view',
        'SELECT "a"."id" AS "id_atleta", coalesce(sum("f"."recepcoes"), 0) AS "recepcoes" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_escalados" "ae" ON "ae"."id"="f"."id_atleta_escalado" AND ("ae"."id" = "f"."id_atleta_escalado" AND "ae"."posicao" = \'libero\')  INNER JOIN "atletas" "a" ON "a"."id"="ae"."id_atleta" GROUP BY "a"."id" ORDER BY recepcoes DESC',
      ],
    );
  }
}
