import {MigrationInterface, QueryRunner} from "typeorm";

export class AlteraPartidaTipoRodada1654285916284 implements MigrationInterface {
    name = 'AlteraPartidaTipoRodada1654285916284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partidas" RENAME COLUMN "numero_da_rodada" TO "tipo_da_rodada"`);
        await queryRunner.query(`ALTER TABLE "partidas" DROP COLUMN "tipo_da_rodada"`);
        await queryRunner.query(`ALTER TABLE "partidas" ADD "tipo_da_rodada" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tabela" DROP CONSTRAINT "FK_2926a2d1ad0c231ae405c17046e"`);
        await queryRunner.query(`ALTER TABLE "tabela" ADD CONSTRAINT "UQ_2926a2d1ad0c231ae405c17046e" UNIQUE ("id")`);
        await queryRunner.query(`CREATE INDEX "IDX_46c7d22d926d54be04f18fe4cc" ON "tabela" ("pontuacao") `);
        await queryRunner.query(`ALTER TABLE "tabela" ADD CONSTRAINT "FK_2926a2d1ad0c231ae405c17046e" FOREIGN KEY ("id") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tabela" DROP CONSTRAINT "FK_2926a2d1ad0c231ae405c17046e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_46c7d22d926d54be04f18fe4cc"`);
        await queryRunner.query(`ALTER TABLE "tabela" DROP CONSTRAINT "UQ_2926a2d1ad0c231ae405c17046e"`);
        await queryRunner.query(`ALTER TABLE "tabela" ADD CONSTRAINT "FK_2926a2d1ad0c231ae405c17046e" FOREIGN KEY ("id") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partidas" DROP COLUMN "tipo_da_rodada"`);
        await queryRunner.query(`ALTER TABLE "partidas" ADD "tipo_da_rodada" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partidas" RENAME COLUMN "tipo_da_rodada" TO "numero_da_rodada"`);
    }

}
