import { MigrationInterface, QueryRunner } from 'typeorm';

export class EquipePartidaCircularDep1655328926296
  implements MigrationInterface
{
  name = 'EquipePartidaCircularDep1655328926296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" DROP CONSTRAINT "FK_b38dc0d6c02b7dc8d01243694fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ALTER COLUMN "id_partida" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ADD CONSTRAINT "FK_b38dc0d6c02b7dc8d01243694fe" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" DROP CONSTRAINT "FK_b38dc0d6c02b7dc8d01243694fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ALTER COLUMN "id_partida" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ADD CONSTRAINT "FK_b38dc0d6c02b7dc8d01243694fe" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
