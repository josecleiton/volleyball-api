import { MigrationInterface, QueryRunner } from 'typeorm';

export class MelhoresOpostosView1656339920419 implements MigrationInterface {
  name = 'MelhoresOpostosView1656339920419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'melhores_pontas_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "melhores_pontas_view"`);
    await queryRunner.query(`CREATE MATERIALIZED VIEW "melhores_opostos_view" AS 
    WITH ac AS (
      SELECT
        a.id AS id,
        COUNT(f.id) AS qtd,
        SUM(f.aces) AS total_aces,
        SUM(f.saques) AS total_saques,
        SUM(f.ataques) AS total_ataques,
        SUM(f.pontos) AS total_pontos
      FROM fundamentos_atletas AS f
      INNER JOIN atletas_escalados AS ae
      ON
        ae.id = f.id_atleta_escalado
        AND ae.posicao = 'oposto'
      INNER JOIN atletas AS a
      ON
        a.id = ae.id_atleta
      GROUP BY a.id
    )

    SELECT
      ac.id AS id_atleta,
      ac.qtd AS quantidade_partidas,
      COALESCE(ac.total_pontos / NULLIF(ac.qtd, 0), 0) AS pontos_por_partida,
      COALESCE(ac.total_pontos / NULLIF(ac.total_ataques, 0), 0) AS ataques_efetivos,
      COALESCE(ac.total_aces / NULLIF(ac.qtd, 0), 0) AS aces_por_partida,
      COALESCE(ac.total_aces / NULLIF(ac.total_saques, 0), 0) AS saques_efetivos
    FROM ac
`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'melhores_opostos_view',
        "WITH ac AS (\n      SELECT\n        a.id AS id,\n        COUNT(f.id) AS qtd,\n        SUM(f.aces) AS total_aces,\n        SUM(f.saques) AS total_saques,\n        SUM(f.ataques) AS total_ataques,\n        SUM(f.pontos) AS total_pontos\n      FROM fundamentos_atletas AS f\n      INNER JOIN atletas_escalados AS ae\n      ON\n        ae.id = f.id_atleta_escalado\n        AND ae.posicao = 'oposto'\n      INNER JOIN atletas AS a\n      ON\n        a.id = ae.id_atleta\n      GROUP BY a.id\n    )\n\n    SELECT\n      ac.id AS id_atleta,\n      ac.qtd AS quantidade_partidas,\n      COALESCE(ac.total_pontos / NULLIF(ac.qtd, 0), 0) AS pontos_por_partida,\n      COALESCE(ac.total_pontos / NULLIF(ac.total_ataques, 0), 0) AS ataques_efetivos,\n      COALESCE(ac.total_aces / NULLIF(ac.qtd, 0), 0) AS aces_por_partida,\n      COALESCE(ac.total_aces / NULLIF(ac.total_saques, 0), 0) AS saques_efetivos\n    FROM ac",
      ],
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_melhores_opostos_view_idAtleta" ON "melhores_opostos_view" ("id_atleta")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_melhores_opostos_view_media" ON "melhores_opostos_view" ("quantidade_partidas" DESC, "pontos_por_partida" DESC, "ataques_efetivos" DESC, "aces_por_partida" DESC, "saques_efetivos" DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'melhores_opostos_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "melhores_opostos_view"`);
  }
}
