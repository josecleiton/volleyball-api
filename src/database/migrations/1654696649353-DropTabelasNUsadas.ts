import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropTabelasNUsadas1654696649353 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS partida`);
    await queryRunner.query(`DROP TABLE IF EXISTS pontuacoes_partida`);
    await queryRunner.query(`DROP TABLE IF EXISTS pontuacoes_equipe`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1`);
  }
}
