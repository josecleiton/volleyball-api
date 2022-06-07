import { MigrationInterface, QueryRunner } from 'typeorm';

export class CriaMelhorLiberoView1654530011934 implements MigrationInterface {
  name = 'CriaMelhorLiberoView1654530011934';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE MATERIALIZED VIEW "melhores_liberos_view" AS SELECT "a"."id" AS "id_atleta", coalesce(sum(f.recepcoes), 0) AS "recepcoes" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_partida" "a" ON "a"."id"="f"."id_atleta_partida" GROUP BY "a"."id" ORDER BY recepcoes DESC`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'melhores_liberos_view',
        'SELECT "a"."id" AS "id_atleta", coalesce(sum(f.recepcoes), 0) AS "recepcoes" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_partida" "a" ON "a"."id"="f"."id_atleta_partida" GROUP BY "a"."id" ORDER BY recepcoes DESC',
      ],
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_melhores_liberos_view_id_atleta" ON "melhores_liberos_view" ("id_atleta")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "UQ_melhores_liberos_view_id_atleta"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'melhores_liberos_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "melhores_liberos_view"`);
  }
}
