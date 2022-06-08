import { MigrationInterface, QueryRunner } from 'typeorm';

export class EquipePartidasAjustaRelacionamento1654696771004
  implements MigrationInterface
{
  name = 'EquipePartidasAjustaRelacionamento1654696771004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" DROP CONSTRAINT "FK_cc63960c07dd47d83524974ef1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" DROP CONSTRAINT "FK_7eea906559e9528e77df2d444d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" DROP COLUMN "equipe_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" DROP COLUMN "partida_id"`,
    );
    await queryRunner.query(`ALTER TABLE "ligas" DROP COLUMN "data_comeco"`);
    await queryRunner.query(`ALTER TABLE "ligas" ADD "data_comeco" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ADD CONSTRAINT "FK_b619e7a5725eaaf9ec76efbc0ff" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ADD CONSTRAINT "FK_b38dc0d6c02b7dc8d01243694fe" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "equipes_partidas" DROP CONSTRAINT "FK_b38dc0d6c02b7dc8d01243694fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" DROP CONSTRAINT "FK_b619e7a5725eaaf9ec76efbc0ff"`,
    );
    await queryRunner.query(`ALTER TABLE "ligas" DROP COLUMN "data_comeco"`);
    await queryRunner.query(
      `ALTER TABLE "ligas" ADD "data_comeco" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ADD "partida_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ADD "equipe_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_55307682a97abeecbe78ef95e2b" FOREIGN KEY ("id_visitante") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_e343fae9dfdbb61550a5b7e26e7" FOREIGN KEY ("id_mandante") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ADD CONSTRAINT "FK_7eea906559e9528e77df2d444d7" FOREIGN KEY ("equipe_id") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ADD CONSTRAINT "FK_cc63960c07dd47d83524974ef1e" FOREIGN KEY ("partida_id") REFERENCES "partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
