import {MigrationInterface, QueryRunner} from "typeorm";

export class AdicionaMaisInfosPontuacaoEquipe1654351254628 implements MigrationInterface {
    name = 'AdicionaMaisInfosPontuacaoEquipe1654351254628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" ADD "vitorias" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" ADD "derrotas" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" ADD "sets_ganhos" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" ADD "sets_perdidos" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" DROP COLUMN "sets_perdidos"`);
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" DROP COLUMN "sets_ganhos"`);
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" DROP COLUMN "derrotas"`);
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" DROP COLUMN "vitorias"`);
    }

}
