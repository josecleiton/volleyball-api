import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditaMelhorLiberoView1654600637313 implements MigrationInterface {
  name = 'EditaMelhorLiberoView1654600637313';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'melhores_liberos_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "melhores_liberos_view"`);
    await queryRunner.query(
      `CREATE MATERIALIZED VIEW "melhores_liberos_view" AS SELECT "a"."id" AS "id_atleta", coalesce(sum("f"."recepcoes"), 0) AS "recepcoes" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_escalados" "ae" ON "ae"."id"="f"."id_atleta_partida"  INNER JOIN "atletas" "a" ON "a"."id"="ae"."id_atleta" GROUP BY "a"."id" ORDER BY recepcoes DESC`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_melhores_liberos_view_id_atleta" ON "melhores_liberos_view" ("id_atleta")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_melhores_liberos_view_recepcoes" ON "melhores_liberos_view" ("recepcoes" DESC)`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'melhores_liberos_view',
        'SELECT "a"."id" AS "id_atleta", coalesce(sum("f"."recepcoes"), 0) AS "recepcoes" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_escalados" "ae" ON "ae"."id"="f"."id_atleta_partida"  INNER JOIN "atletas" "a" ON "a"."id"="ae"."id_atleta" GROUP BY "a"."id" ORDER BY recepcoes DESC',
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
  }
}
