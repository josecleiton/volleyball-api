import {MigrationInterface, QueryRunner} from "typeorm";

export class CriaTabela1654133266638 implements MigrationInterface {
    name = 'CriaTabela1654133266638'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tabela" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "pontuacao" integer NOT NULL DEFAULT '0', CONSTRAINT "REL_2926a2d1ad0c231ae405c17046" UNIQUE ("id"), CONSTRAINT "PK_2926a2d1ad0c231ae405c17046e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_db2fcc239a947890b2c2dee053" ON "tabela" ("data_criacao") `);
        await queryRunner.query(`ALTER TYPE "public"."partidas_status_enum" RENAME TO "partidas_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."partidas_status_enum" AS ENUM('agendada', 'participantes_cadastrados', 'wo', 'concluida')`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" TYPE "public"."partidas_status_enum" USING "status"::"text"::"public"."partidas_status_enum"`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" SET DEFAULT 'agendada'`);
        await queryRunner.query(`DROP TYPE "public"."partidas_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "tabela" ADD CONSTRAINT "FK_2926a2d1ad0c231ae405c17046e" FOREIGN KEY ("id") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tabela" DROP CONSTRAINT "FK_2926a2d1ad0c231ae405c17046e"`);
        await queryRunner.query(`CREATE TYPE "public"."partidas_status_enum_old" AS ENUM('agendada', 'em_andamento', 'wo', 'concluida')`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" TYPE "public"."partidas_status_enum_old" USING "status"::"text"::"public"."partidas_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" SET DEFAULT 'agendada'`);
        await queryRunner.query(`DROP TYPE "public"."partidas_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."partidas_status_enum_old" RENAME TO "partidas_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_db2fcc239a947890b2c2dee053"`);
        await queryRunner.query(`DROP TABLE "tabela"`);
    }

}
