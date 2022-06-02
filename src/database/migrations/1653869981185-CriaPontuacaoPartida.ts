import {MigrationInterface, QueryRunner} from "typeorm";

export class CriaPontuacaoPartida1653869981185 implements MigrationInterface {
    name = 'CriaPontuacaoPartida1653869981185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pontuacoes_partida" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "mandante" integer NOT NULL DEFAULT '0', "visitante" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_53b22b00bd03670e2b806b296e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_726a8f23369f264714b4c21e78" ON "pontuacoes_partida" ("data_criacao") `);
        await queryRunner.query(`ALTER TABLE "arbitros_partida" DROP CONSTRAINT "FK_f2e52bb8b002c915b80af6bad60"`);
        await queryRunner.query(`ALTER TABLE "atletas_partida" DROP CONSTRAINT "FK_df6e397136448e8cd4a3e00b6a3"`);
        await queryRunner.query(`ALTER TABLE "partidas" ADD CONSTRAINT "UQ_6e9cc7455a900d190278156517c" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TYPE "public"."partidas_status_enum" RENAME TO "partidas_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."partidas_status_enum" AS ENUM('agendada', 'em_andamento', 'wo', 'concluida')`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" TYPE "public"."partidas_status_enum" USING "status"::"text"::"public"."partidas_status_enum"`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" SET DEFAULT 'agendada'`);
        await queryRunner.query(`DROP TYPE "public"."partidas_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "arbitros_partida" ADD CONSTRAINT "FK_f2e52bb8b002c915b80af6bad60" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partidas" ADD CONSTRAINT "FK_6e9cc7455a900d190278156517c" FOREIGN KEY ("id") REFERENCES "pontuacoes_partida"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "atletas_partida" ADD CONSTRAINT "FK_df6e397136448e8cd4a3e00b6a3" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "atletas_partida" DROP CONSTRAINT "FK_df6e397136448e8cd4a3e00b6a3"`);
        await queryRunner.query(`ALTER TABLE "partidas" DROP CONSTRAINT "FK_6e9cc7455a900d190278156517c"`);
        await queryRunner.query(`ALTER TABLE "arbitros_partida" DROP CONSTRAINT "FK_f2e52bb8b002c915b80af6bad60"`);
        await queryRunner.query(`CREATE TYPE "public"."partidas_status_enum_old" AS ENUM('agendada', 'em_andamento', 'concluida')`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" TYPE "public"."partidas_status_enum_old" USING "status"::"text"::"public"."partidas_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "partidas" ALTER COLUMN "status" SET DEFAULT 'agendada'`);
        await queryRunner.query(`DROP TYPE "public"."partidas_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."partidas_status_enum_old" RENAME TO "partidas_status_enum"`);
        await queryRunner.query(`ALTER TABLE "partidas" DROP CONSTRAINT "UQ_6e9cc7455a900d190278156517c"`);
        await queryRunner.query(`ALTER TABLE "atletas_partida" ADD CONSTRAINT "FK_df6e397136448e8cd4a3e00b6a3" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "arbitros_partida" ADD CONSTRAINT "FK_f2e52bb8b002c915b80af6bad60" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP INDEX "public"."IDX_726a8f23369f264714b4c21e78"`);
        await queryRunner.query(`DROP TABLE "pontuacoes_partida"`);
    }

}
