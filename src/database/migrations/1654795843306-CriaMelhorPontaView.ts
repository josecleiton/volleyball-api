import { MigrationInterface, QueryRunner } from 'typeorm';

export class CriaMelhorPontaView1654795843306 implements MigrationInterface {
  name = 'CriaMelhorPontaView1654795843306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE MATERIALIZED VIEW "melhores_pontas_view" AS 
    WITH ac AS (
      SELECT
        a.id AS id,
        COUNT(f.id) AS qtd,
        SUM(f.aces) AS total_aces,
        SUM(f.saques) AS total_saques
      FROM fundamentos_atletas AS f
      INNER JOIN atletas_escalados AS ae
      ON
        ae.id = f.id_atleta_escalado
        AND ae.posicao = 'ponta'
      INNER JOIN atletas AS a
      ON
        a.id = ae.id_atleta
      GROUP BY a.id
    )

    SELECT
      ac.id AS id_atleta,
      ac.qtd AS quantidade_partidas,
      COALESCE(ac.total_aces / NULLIF(ac.qtd, 0), 0) AS aces_por_partida,
      COALESCE(ac.total_aces / NULLIF(ac.total_saques, 0), 0) AS saques_efetivos
    FROM ac
`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_melhores_pontas_view_idAtleta" ON "melhores_pontas_view" ("id_atleta") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_melhores_pontas_view_media" ON "melhores_pontas_view" ("quantidade_partidas" DESC, "aces_por_partida" DESC, "saques_efetivos" DESC)`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'melhores_pontas_view',
        "WITH ac AS (\n      SELECT\n        a.id AS id,\n        COUNT(f.id) AS qtd,\n        SUM(f.aces) AS total_aces,\n        SUM(f.saques) AS total_saques\n      FROM fundamentos_atletas AS f\n      INNER JOIN atletas_escalados AS ae\n      ON\n        ae.id = f.id_atleta_escalado\n        AND ae.posicao = 'ponta'\n      INNER JOIN atletas AS a\n      ON\n        a.id = ae.id_atleta\n      GROUP BY a.id\n    )\n\n    SELECT\n      ac.id AS id_atleta,\n      ac.qtd AS quantidade_partidas,\n      COALESCE(ac.total_aces / NULLIF(ac.qtd, 0), 0) AS aces_por_partida,\n      COALESCE(ac.total_aces / NULLIF(ac.total_saques, 0), 0) AS saques_efetivos\n    FROM ac",
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'melhores_pontas_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "melhores_pontas_view"`);
  }
}
