import {MigrationInterface, QueryRunner} from "typeorm";

export class CriaPartida1653868400725 implements MigrationInterface {
    name = 'CriaPartida1653868400725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."arbitros_partida_tipo_enum" AS ENUM('principal')`);
        await queryRunner.query(`CREATE TABLE "arbitros_partida" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "id_arbitro" uuid NOT NULL, "id_partida" uuid NOT NULL, "tipo" "public"."arbitros_partida_tipo_enum" NOT NULL, CONSTRAINT "UQ_ae4b3991d0adda08c553a527112" UNIQUE ("id_arbitro", "id_partida"), CONSTRAINT "PK_2b4e130b3202e3802f7de26c329" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2d8319b8833c5b7e11f7479656" ON "arbitros_partida" ("data_criacao") `);
        await queryRunner.query(`CREATE INDEX "IDX_756f1be552d523d58d73102dae" ON "arbitros_partida" ("id_arbitro") `);
        await queryRunner.query(`CREATE INDEX "IDX_f2e52bb8b002c915b80af6bad6" ON "arbitros_partida" ("id_partida") `);
        await queryRunner.query(`CREATE TYPE "public"."partidas_status_enum" AS ENUM('agendada', 'em_andamento', 'concluida')`);
        await queryRunner.query(`CREATE TABLE "partidas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "id_delegado" uuid, "id_ginasio" uuid NOT NULL, "numero_da_rodada" integer NOT NULL, "id_mandante" uuid NOT NULL, "id_visitante" uuid NOT NULL, "status" "public"."partidas_status_enum" NOT NULL DEFAULT 'agendada', "data_comeco" TIMESTAMP NOT NULL, "data_finalizacao" TIMESTAMP, "id_equipe_ganhador" uuid, "id_equipe_visitante" uuid, "id_equipe_mandante" uuid, CONSTRAINT "PK_6e9cc7455a900d190278156517c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_508fa5dcd45311256c19d5aa81" ON "partidas" ("data_criacao") `);
        await queryRunner.query(`CREATE INDEX "IDX_de94a09c62e98501363519b05c" ON "partidas" ("id_delegado") `);
        await queryRunner.query(`CREATE INDEX "IDX_e0872826715a9d03d6e1bcdbb1" ON "partidas" ("id_ginasio") `);
        await queryRunner.query(`CREATE INDEX "IDX_e343fae9dfdbb61550a5b7e26e" ON "partidas" ("id_mandante") `);
        await queryRunner.query(`CREATE INDEX "IDX_55307682a97abeecbe78ef95e2" ON "partidas" ("id_visitante") `);
        await queryRunner.query(`CREATE INDEX "IDX_2156f57a412039f3e0ccb951a2" ON "partidas" ("id_equipe_ganhador") `);
        await queryRunner.query(`CREATE TYPE "public"."atletas_partida_posicao_enum" AS ENUM('ponta', 'oposto', 'central', 'libero', 'levantador')`);
        await queryRunner.query(`CREATE TABLE "atletas_partida" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "id_partida" uuid NOT NULL, "id_atleta" uuid NOT NULL, "posicao" "public"."atletas_partida_posicao_enum" NOT NULL, CONSTRAINT "UQ_f49976721f8e1ee1dca4fe786eb" UNIQUE ("id_atleta", "id_partida"), CONSTRAINT "PK_7cf400fce1a35afc733208a2269" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9196779f164c70849d8bcea0d2" ON "atletas_partida" ("data_criacao") `);
        await queryRunner.query(`CREATE INDEX "IDX_df6e397136448e8cd4a3e00b6a" ON "atletas_partida" ("id_partida") `);
        await queryRunner.query(`CREATE INDEX "IDX_672b2f57320fd03957d23ed7d5" ON "atletas_partida" ("id_atleta") `);
        await queryRunner.query(`ALTER TABLE "atletas" DROP COLUMN "posicao"`);
        await queryRunner.query(`DROP TYPE "public"."atletas_posicao_enum"`);
        await queryRunner.query(`ALTER TABLE "arbitros_partida" ADD CONSTRAINT "FK_756f1be552d523d58d73102dae1" FOREIGN KEY ("id_arbitro") REFERENCES "arbitros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "arbitros_partida" ADD CONSTRAINT "FK_f2e52bb8b002c915b80af6bad60" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partidas" ADD CONSTRAINT "FK_de94a09c62e98501363519b05cf" FOREIGN KEY ("id_delegado") REFERENCES "delegados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partidas" ADD CONSTRAINT "FK_e0872826715a9d03d6e1bcdbb14" FOREIGN KEY ("id_ginasio") REFERENCES "ginasios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partidas" ADD CONSTRAINT "FK_2156f57a412039f3e0ccb951a21" FOREIGN KEY ("id_equipe_ganhador") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partidas" ADD CONSTRAINT "FK_5e275812a0861e5b9e56adf02fc" FOREIGN KEY ("id_equipe_visitante") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partidas" ADD CONSTRAINT "FK_c7c95e31a3db527a6efdac0c345" FOREIGN KEY ("id_equipe_mandante") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "atletas_partida" ADD CONSTRAINT "FK_df6e397136448e8cd4a3e00b6a3" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "atletas_partida" ADD CONSTRAINT "FK_672b2f57320fd03957d23ed7d5e" FOREIGN KEY ("id_atleta") REFERENCES "atletas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "atletas_partida" DROP CONSTRAINT "FK_672b2f57320fd03957d23ed7d5e"`);
        await queryRunner.query(`ALTER TABLE "atletas_partida" DROP CONSTRAINT "FK_df6e397136448e8cd4a3e00b6a3"`);
        await queryRunner.query(`ALTER TABLE "partidas" DROP CONSTRAINT "FK_c7c95e31a3db527a6efdac0c345"`);
        await queryRunner.query(`ALTER TABLE "partidas" DROP CONSTRAINT "FK_5e275812a0861e5b9e56adf02fc"`);
        await queryRunner.query(`ALTER TABLE "partidas" DROP CONSTRAINT "FK_2156f57a412039f3e0ccb951a21"`);
        await queryRunner.query(`ALTER TABLE "partidas" DROP CONSTRAINT "FK_e0872826715a9d03d6e1bcdbb14"`);
        await queryRunner.query(`ALTER TABLE "partidas" DROP CONSTRAINT "FK_de94a09c62e98501363519b05cf"`);
        await queryRunner.query(`ALTER TABLE "arbitros_partida" DROP CONSTRAINT "FK_f2e52bb8b002c915b80af6bad60"`);
        await queryRunner.query(`ALTER TABLE "arbitros_partida" DROP CONSTRAINT "FK_756f1be552d523d58d73102dae1"`);
        await queryRunner.query(`CREATE TYPE "public"."atletas_posicao_enum" AS ENUM('ponta', 'oposto', 'central', 'libero', 'levantador')`);
        await queryRunner.query(`ALTER TABLE "atletas" ADD "posicao" "public"."atletas_posicao_enum" NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_672b2f57320fd03957d23ed7d5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df6e397136448e8cd4a3e00b6a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9196779f164c70849d8bcea0d2"`);
        await queryRunner.query(`DROP TABLE "atletas_partida"`);
        await queryRunner.query(`DROP TYPE "public"."atletas_partida_posicao_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2156f57a412039f3e0ccb951a2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_55307682a97abeecbe78ef95e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e343fae9dfdbb61550a5b7e26e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e0872826715a9d03d6e1bcdbb1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_de94a09c62e98501363519b05c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_508fa5dcd45311256c19d5aa81"`);
        await queryRunner.query(`DROP TABLE "partidas"`);
        await queryRunner.query(`DROP TYPE "public"."partidas_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f2e52bb8b002c915b80af6bad6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_756f1be552d523d58d73102dae"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2d8319b8833c5b7e11f7479656"`);
        await queryRunner.query(`DROP TABLE "arbitros_partida"`);
        await queryRunner.query(`DROP TYPE "public"."arbitros_partida_tipo_enum"`);
    }

}
