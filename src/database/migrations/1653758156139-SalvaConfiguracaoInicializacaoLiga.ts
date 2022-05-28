import {MigrationInterface, QueryRunner} from "typeorm";

export class SalvaConfiguracaoInicializacaoLiga1653758156139 implements MigrationInterface {
    name = 'SalvaConfiguracaoInicializacaoLiga1653758156139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ligas" ADD "configuracao_inicializacao_liga" jsonb`);
        await queryRunner.query(`ALTER TABLE "ligas" ALTER COLUMN "serie" SET DEFAULT 'A'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ligas" ALTER COLUMN "serie" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ligas" DROP COLUMN "configuracao_inicializacao_liga"`);
    }

}
