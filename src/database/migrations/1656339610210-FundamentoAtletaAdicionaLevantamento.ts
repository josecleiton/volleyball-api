import { MigrationInterface, QueryRunner } from 'typeorm';

export class FundamentoAtletaAdicionaLevantamento1656339610210
  implements MigrationInterface
{
  name = 'FundamentoAtletaAdicionaLevantamento1656339610210';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" ADD "levantamentos" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" ADD "assistencias" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" DROP COLUMN "assistencias"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" DROP COLUMN "levantamentos"`,
    );
  }
}
