import { MigrationInterface, QueryRunner } from 'typeorm';

export class EquipeAdicionaIdxIdLiga1655655121730
  implements MigrationInterface
{
  name = 'EquipeAdicionaIdxIdLiga1655655121730';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_c889de707e36b235a08c65e41c" ON "equipes" ("id_liga") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c889de707e36b235a08c65e41c"`,
    );
  }
}
