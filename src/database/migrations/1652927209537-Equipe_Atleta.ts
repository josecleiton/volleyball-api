import {MigrationInterface, QueryRunner} from "typeorm";

export class EquipeAtleta1652927209537 implements MigrationInterface {
    name = 'EquipeAtleta1652927209537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pessoa" RENAME COLUMN "idade" TO "data_nascimento"`);
        await queryRunner.query(`CREATE TYPE "public"."atleta_posicao_enum" AS ENUM('ponta', 'oposto', 'central', 'libero', 'levantador')`);
        await queryRunner.query(`CREATE TABLE "atleta" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "posicao" "public"."atleta_posicao_enum" NOT NULL, "numero" smallint NOT NULL, "id_equipe" character varying NOT NULL, "id_pessoa" uuid NOT NULL, CONSTRAINT "UQ_atletas_numero_por_equipe" UNIQUE ("numero", "id_equipe"), CONSTRAINT "REL_a980b908e8ffe40a5f1007b5d9" UNIQUE ("id_pessoa"), CONSTRAINT "PK_e684c9f26a8c7f0b0681baef80e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pessoa" DROP COLUMN "data_nascimento"`);
        await queryRunner.query(`ALTER TABLE "pessoa" ADD "data_nascimento" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "atleta" ADD CONSTRAINT "FK_a980b908e8ffe40a5f1007b5d96" FOREIGN KEY ("id_pessoa") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "atleta" DROP CONSTRAINT "FK_a980b908e8ffe40a5f1007b5d96"`);
        await queryRunner.query(`ALTER TABLE "pessoa" DROP COLUMN "data_nascimento"`);
        await queryRunner.query(`ALTER TABLE "pessoa" ADD "data_nascimento" smallint NOT NULL`);
        await queryRunner.query(`DROP TABLE "atleta"`);
        await queryRunner.query(`DROP TYPE "public"."atleta_posicao_enum"`);
        await queryRunner.query(`ALTER TABLE "pessoa" RENAME COLUMN "data_nascimento" TO "idade"`);
    }

}
