import { MigrationInterface, QueryRunner } from 'typeorm';

export class PontuacaoViewAjustaQuery1655760085847
  implements MigrationInterface
{
  name = 'PontuacaoViewAjustaQuery1655760085847';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'pontuacoes_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "pontuacoes_view"`);
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'melhores_liberos_view',
        "WITH ac AS (\n      SELECT\n        a.id AS id,\n        COUNT(f.id) AS qtd,\n        SUM(f.recepcoes) AS total\n      FROM fundamentos_atletas AS f\n      INNER JOIN atletas_escalados AS ae\n      ON\n        ae.id = f.id_atleta_escalado\n        AND ae.posicao = 'libero'\n      INNER JOIN atletas AS a\n      ON\n        a.id = ae.id_atleta\n      GROUP BY a.id\n    )\n\n    SELECT\n      ac.id AS id_atleta,\n      ac.qtd AS quantidade_partidas,\n      COALESCE(ac.total / NULLIF(ac.qtd, 0), 0) AS recepcoes_por_partida\n    FROM ac",
      ],
    );
    await queryRunner.query(`CREATE MATERIALIZED VIEW "pontuacoes_view" AS 
    WITH total_pontos_ep AS (
      SELECT 
        ep.id AS id,
        COALESCE(SUM((value->>'quantidade')::int),0) as total_pontos
      FROM equipes_partidas AS ep
      INNER JOIN partidas AS p
      ON
        p.id = ep.id_partida
        AND p.tipo_da_rodada IN ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22')
      CROSS JOIN LATERAL jsonb_array_elements(pontos_nos_sets)
      GROUP BY ep.id
    ),
    partidas_disputadas AS (
      SELECT
        ep.id_equipe AS id,
        COUNT(p.id) AS qtd,
        SUM(ep.ganhou) AS ganhou
      FROM equipes_partidas AS ep
      INNER JOIN partidas AS p
      ON
        p.id = ep.id_partida
        AND p.status IN ('wo', 'concluida')
      GROUP BY ep.id_equipe
    )
    
    SELECT
      e.id AS id_equipe,
      SUM(ep.pontuacao) AS pontuacao,
      SUM(ep.sets_ganhos) AS sets_ganhos,
      SUM(ep.sets_disputados) AS sets_disputados,
      COALESCE(pd.qtd, 0) AS partidas_disputadas,
      COALESCE(pd.ganhou, 0) AS partidas_ganhas,
      SUM(ep.sets_disputados) - SUM(ep.sets_ganhos) AS sets_perdidos,
      COALESCE(pd.qtd, 0) - COALESCE(pd.ganhou, 0) AS partidas_perdidas,
      COALESCE(SUM(total_pontos_ep.total_pontos) / NULLIF(SUM(ep.sets_disputados), 0)::double precision, 0) AS pontos_average,
      COALESCE(SUM(ep.sets_ganhos) / NULLIF(SUM(ep.sets_disputados), 0)::double precision, 0) AS sets_average
    FROM equipes AS e
    INNER JOIN equipes_partidas AS ep
      ON ep.id_equipe = e.id
    LEFT JOIN total_pontos_ep
      ON total_pontos_ep.id = ep.id
    LEFT JOIN partidas_disputadas AS pd
      ON pd.id = e.id
    GROUP BY e.id, pd.qtd, pd.ganhou
  `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_pontuacoes_view_id_equipe" ON "pontuacoes_view" ("id_equipe")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_pontuacoes_view_pontuacao" ON "pontuacoes_view" ("pontuacao")`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'pontuacoes_view',
        "WITH total_pontos_ep AS (\n      SELECT \n        ep.id AS id,\n        COALESCE(SUM((value->>'quantidade')::int),0) as total_pontos\n      FROM equipes_partidas AS ep\n      INNER JOIN partidas AS p\n      ON\n        p.id = ep.id_partida\n        AND p.tipo_da_rodada IN ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22')\n      CROSS JOIN LATERAL jsonb_array_elements(pontos_nos_sets)\n      GROUP BY ep.id\n    ),\n    partidas_disputadas AS (\n      SELECT\n        ep.id_equipe AS id,\n        COUNT(p.id) AS qtd,\n        SUM(ep.ganhou) AS ganhou\n      FROM equipes_partidas AS ep\n      INNER JOIN partidas AS p\n      ON\n        p.id = ep.id_partida\n        AND p.status IN ('wo', 'concluida')\n      GROUP BY ep.id_equipe\n    )\n    \n    SELECT\n      e.id AS id_equipe,\n      SUM(ep.pontuacao) AS pontuacao,\n      SUM(ep.sets_ganhos) AS sets_ganhos,\n      SUM(ep.sets_disputados) AS sets_disputados,\n      COALESCE(pd.qtd, 0) AS partidas_disputadas,\n      COALESCE(pd.ganhou, 0) AS partidas_ganhas,\n      SUM(ep.sets_disputados) - SUM(ep.sets_ganhos) AS sets_perdidos,\n      COALESCE(pd.qtd, 0) - COALESCE(pd.ganhou, 0) AS partidas_perdidas,\n      COALESCE(SUM(total_pontos_ep.total_pontos) / NULLIF(SUM(ep.sets_disputados), 0)::double precision, 0) AS pontos_average,\n      COALESCE(SUM(ep.sets_ganhos) / NULLIF(SUM(ep.sets_disputados), 0)::double precision, 0) AS sets_average\n    FROM equipes AS e\n    INNER JOIN equipes_partidas AS ep\n      ON ep.id_equipe = e.id\n    LEFT JOIN total_pontos_ep\n      ON total_pontos_ep.id = ep.id\n    LEFT JOIN partidas_disputadas AS pd\n      ON pd.id = e.id\n    GROUP BY e.id, pd.qtd, pd.ganhou",
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'pontuacoes_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "pontuacoes_view"`);
  }
}
