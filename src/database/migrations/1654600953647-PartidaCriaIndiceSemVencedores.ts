import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartidaCriaIndiceSemVencedores1654600953647
  implements MigrationInterface
{
  name = 'PartidaCriaIndiceSemVencedores1654600953647';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IX_partidas_RemovePartidasSemVencedores" ON "partidas" ("status") WHERE id_ganhadora IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IX_partidas_RemovePartidasSemVencedores"`,
    );
  }
}
