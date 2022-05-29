import {MigrationInterface, QueryRunner} from "typeorm";

export class AdicionaNumeroDaRodadaNaPartida1653791739397 implements MigrationInterface {
    name = 'AdicionaNumeroDaRodadaNaPartida1653791739397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partida" ADD "numero_da_rodada" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partida" DROP COLUMN "numero_da_rodada"`);
    }

}
