import { MigrationInterface, QueryRunner } from 'typeorm';

export class CriaMelhorCentralView1654692169345 implements MigrationInterface {
  name = 'CriaMelhorCentralView1654692169345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE MATERIALIZED VIEW "melhores_centrais_view" AS SELECT "a"."id" AS "id_atleta", COALESCE(SUM("f"."bloqueios"), 0) AS "bloqueios" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_escalados" "ae" ON "ae"."id"="f"."id_atleta_partida"  INNER JOIN "atletas" "a" ON "a"."id"="ae"."id_atleta" GROUP BY "a"."id" ORDER BY bloqueios DESC`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'melhores_centrais_view',
        'SELECT "a"."id" AS "id_atleta", COALESCE(SUM("f"."bloqueios"), 0) AS "bloqueios" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_escalados" "ae" ON "ae"."id"="f"."id_atleta_partida"  INNER JOIN "atletas" "a" ON "a"."id"="ae"."id_atleta" GROUP BY "a"."id" ORDER BY bloqueios DESC',
      ],
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_melhores_centrais_view_idAtleta" ON "melhores_centrais_view" ("id_atleta")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_melhores_centrais_view_bloqueios" ON "melhores_centrais_view" ("bloqueios" DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'melhores_centrais_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "melhores_centrais_view"`);
  }
}
