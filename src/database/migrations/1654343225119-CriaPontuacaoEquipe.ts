import {MigrationInterface, QueryRunner} from "typeorm";

export class CriaPontuacaoEquipe1654343225119 implements MigrationInterface {
    name = 'CriaPontuacaoEquipe1654343225119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partidas" RENAME COLUMN "numero_da_rodada" TO "tipo_da_rodada"`);
        await queryRunner.query(`CREATE TABLE "pontuacoes_equipe" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "pontuacao" integer NOT NULL DEFAULT '0', CONSTRAINT "REL_84e687cbbe490a5ffd7926ca85" UNIQUE ("id"), CONSTRAINT "PK_84e687cbbe490a5ffd7926ca85a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c961dca19f682ffe41507e2922" ON "pontuacoes_equipe" ("data_criacao") `);
        await queryRunner.query(`CREATE INDEX "IDX_ad3f6bd0a1226ab2d09a9012e6" ON "pontuacoes_equipe" ("pontuacao") `);
        await queryRunner.query(`ALTER TABLE "partidas" DROP COLUMN "tipo_da_rodada"`);
        await queryRunner.query(`ALTER TABLE "partidas" ADD "tipo_da_rodada" character varying NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."partidas_status_enum" RENAME TO "partidas_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."partidas_status_enum" AS ENUM('agendada', 'participantes_cadastrados', 'wo', 'concluida')`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" TYPE "public"."partidas_status_enum" USING "status"::"text"::"public"."partidas_status_enum"`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" SET DEFAULT 'agendada'`);
        await queryRunner.query(`DROP TYPE "public"."partidas_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" ADD CONSTRAINT "FK_84e687cbbe490a5ffd7926ca85a" FOREIGN KEY ("id") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pontuacoes_equipe" DROP CONSTRAINT "FK_84e687cbbe490a5ffd7926ca85a"`);
        await queryRunner.query(`CREATE TYPE "public"."partidas_status_enum_old" AS ENUM('agendada', 'em_andamento', 'wo', 'concluida')`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" TYPE "public"."partidas_status_enum_old" USING "status"::"text"::"public"."partidas_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" SET DEFAULT 'agendada'`);
        await queryRunner.query(`DROP TYPE "public"."partidas_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."partidas_status_enum_old" RENAME TO "partidas_status_enum"`);
        await queryRunner.query(`ALTER TABLE "partidas" DROP COLUMN "tipo_da_rodada"`);
        await queryRunner.query(`ALTER TABLE "partidas" ADD "tipo_da_rodada" integer NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad3f6bd0a1226ab2d09a9012e6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c961dca19f682ffe41507e2922"`);
        await queryRunner.query(`DROP TABLE "pontuacoes_equipe"`);
        await queryRunner.query(`ALTER TABLE "partidas" RENAME COLUMN "tipo_da_rodada" TO "numero_da_rodada"`);
    }

}
