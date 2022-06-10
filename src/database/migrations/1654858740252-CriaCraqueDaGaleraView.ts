import { MigrationInterface, QueryRunner } from 'typeorm';

export class CriaCraqueDaGaleraView1654858740252 implements MigrationInterface {
  name = 'CriaCraqueDaGaleraView1654858740252';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE MATERIALIZED VIEW "craques_da_galera_view" AS SELECT "a"."id" AS "id_atleta", COUNT("vg"."id") AS "quantidade_votos" FROM "votos_da_galera" "vg" INNER JOIN "atletas" "a" ON "a"."id"="vg"."id_atleta" WHERE "vg"."verificado_em" IS NOT NULL GROUP BY "a"."id"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_craques_da_galera_view_idAtleta" ON "craques_da_galera_view" ("id_atleta")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_craques_da_galera_view_quantidadeVotos" ON "craques_da_galera_view" ("quantidade_votos" DESC)`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'craques_da_galera_view',
        'SELECT "a"."id" AS "id_atleta", COUNT("vg"."id") AS "quantidade_votos" FROM "votos_da_galera" "vg" INNER JOIN "atletas" "a" ON "a"."id"="vg"."id_atleta" WHERE "vg"."verificado_em" IS NOT NULL GROUP BY "a"."id"',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'craques_da_galera_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "craques_da_galera_view"`);
  }
}
