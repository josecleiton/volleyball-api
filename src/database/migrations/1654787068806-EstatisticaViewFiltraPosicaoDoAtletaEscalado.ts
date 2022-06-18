import { MigrationInterface, QueryRunner } from 'typeorm';

export class EstatisticaViewFiltraPosicaoDoAtletaEscalado1654787068806
  implements MigrationInterface
{
  name = 'EstatisticaViewFiltraPosicaoDoAtletaEscalado1654787068806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'melhores_centrais_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "melhores_centrais_view"`);
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['MATERIALIZED_VIEW', 'melhores_liberos_view', 'public'],
    );
    await queryRunner.query(`DROP MATERIALIZED VIEW "melhores_liberos_view"`);
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_e343fae9dfdbb61550a5b7e26e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_55307682a97abeecbe78ef95e2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" DROP CONSTRAINT "FK_17be2ae28b3a1b637af04786246"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_17be2ae28b3a1b637af0478624"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" RENAME COLUMN "id_atleta_partida" TO "id_atleta_escalado"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4c4c111efc44499d55fbbabc1c" ON "atletas_escalados" ("posicao") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_449fe4c78fb88327cd9e94c544" ON "fundamentos_atletas" ("id_atleta_escalado") `,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_55307682a97abeecbe78ef95e2b" FOREIGN KEY ("id_visitante") REFERENCES "equipes_partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_e343fae9dfdbb61550a5b7e26e7" FOREIGN KEY ("id_mandante") REFERENCES "equipes_partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" ADD CONSTRAINT "FK_449fe4c78fb88327cd9e94c544e" FOREIGN KEY ("id_atleta_escalado") REFERENCES "atletas_escalados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE MATERIALIZED VIEW "melhores_centrais_view" AS SELECT "a"."id" AS "id_atleta", COALESCE(SUM("f"."bloqueios"), 0) AS "bloqueios" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_escalados" "ae" ON "ae"."id"="f"."id_atleta_escalado" AND ("ae"."id" = "f"."id_atleta_escalado" AND "ae"."posicao" = 'central')  INNER JOIN "atletas" "a" ON "a"."id"="ae"."id_atleta" GROUP BY "a"."id" ORDER BY bloqueios DESC`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_melhores_centrais_view_idAtleta" ON "melhores_centrais_view" ("id_atleta")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_melhores_centrais_view_bloqueios" ON "melhores_centrais_view" ("bloqueios" DESC)`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'MATERIALIZED_VIEW',
        'melhores_centrais_view',
        `SELECT "a"."id" AS "id_atleta", COALESCE(SUM("f"."bloqueios"), 0) AS "bloqueios" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_escalados" "ae" ON "ae"."id"="f"."id_atleta_escalado" AND ("ae"."id" = "f"."id_atleta_escalado" AND "ae"."posicao" = 'central')  INNER JOIN "atletas" "a" ON "a"."id"="ae"."id_atleta" GROUP BY "a"."id" ORDER BY bloqueios DESC`,
      ],
    );
    await queryRunner.query(
      `CREATE MATERIALIZED VIEW "melhores_liberos_view" AS SELECT "a"."id" AS "id_atleta", coalesce(sum("f"."recepcoes"), 0) AS "recepcoes" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_escalados" "ae" ON "ae"."id"="f"."id_atleta_escalado" AND ("ae"."id" = "f"."id_atleta_escalado" AND "ae"."posicao" = 'libero')  INNER JOIN "atletas" "a" ON "a"."id"="ae"."id_atleta" GROUP BY "a"."id" ORDER BY recepcoes DESC`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_melhores_liberos_view_idAtleta" ON "melhores_liberos_view" ("id_atleta")`,
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
        `SELECT "a"."id" AS "id_atleta", coalesce(sum("f"."recepcoes"), 0) AS "recepcoes" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_escalados" "ae" ON "ae"."id"="f"."id_atleta_escalado" AND ("ae"."id" = "f"."id_atleta_escalado" AND "ae"."posicao" = 'libero')  INNER JOIN "atletas" "a" ON "a"."id"="ae"."id_atleta" GROUP BY "a"."id" ORDER BY recepcoes DESC`,
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
      `ALTER TABLE "fundamentos_atletas" DROP CONSTRAINT "FK_449fe4c78fb88327cd9e94c544e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_4a4d635b2764920256ef9e33c4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_e343fae9dfdbb61550a5b7e26e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_55307682a97abeecbe78ef95e2b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_449fe4c78fb88327cd9e94c544"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4c4c111efc44499d55fbbabc1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" RENAME COLUMN "id_atleta_escalado" TO "id_atleta_partida"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17be2ae28b3a1b637af0478624" ON "fundamentos_atletas" ("id_atleta_partida") `,
    );
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" ADD CONSTRAINT "FK_17be2ae28b3a1b637af04786246" FOREIGN KEY ("id_atleta_partida") REFERENCES "atletas_escalados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_55307682a97abeecbe78ef95e2b" FOREIGN KEY ("id_visitante") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_e343fae9dfdbb61550a5b7e26e7" FOREIGN KEY ("id_mandante") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE MATERIALIZED VIEW "melhores_liberos_view" AS SELECT "a"."id" AS "id_atleta", coalesce(sum("f"."recepcoes"), 0) AS "recepcoes" FROM "fundamentos_atletas" "f" INNER JOIN "atletas_escalados" "ae" ON "ae"."id"="f"."id_atleta_partida"  INNER JOIN "atletas" "a" ON "a"."id"="ae"."id_atleta" GROUP BY "a"."id" ORDER BY recepcoes DESC`,
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
  }
}
