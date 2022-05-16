import {MigrationInterface, QueryRunner} from "typeorm";

export class equipePessoa1652631795202 implements MigrationInterface {
    name = 'equipePessoa1652631795202'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pessoa_genero_enum" AS ENUM('feminino', 'masculino')`);
        await queryRunner.query(`CREATE TYPE "public"."pessoa_tipo_enum" AS ENUM('tecnico', 'atleta', 'auxiliar')`);
        await queryRunner.query(`CREATE TABLE "pessoa" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "documento" character varying(50) NOT NULL, "genero" "public"."pessoa_genero_enum" NOT NULL, "idade" smallint NOT NULL, "documento_cbv" character varying(50) NOT NULL, "tipo" "public"."pessoa_tipo_enum" NOT NULL, "pessoa_id" uuid, CONSTRAINT "UQ_b2970aba5cf13df8f618b48a0ca" UNIQUE ("documento_cbv"), CONSTRAINT "REL_588452ad41dec0e31cb096dd41" UNIQUE ("pessoa_id"), CONSTRAINT "PK_bb879ac36994545a5a917a09ba5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "equipe" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "url_brasao" character varying NOT NULL, "apta" boolean NOT NULL, "descricao_aptidao" jsonb NOT NULL, "id_tecnico" character varying NOT NULL, CONSTRAINT "PK_f2503347d661dac29b5a0035f22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tecnico" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "documento_cref" character varying(50) NOT NULL, "id_equipe" character varying NOT NULL, "pessoa_id" uuid, CONSTRAINT "UQ_61014a82d3d115667b06f6b555a" UNIQUE ("documento_cref"), CONSTRAINT "REL_7c755ba13912380914d2f35d03" UNIQUE ("pessoa_id"), CONSTRAINT "PK_7add9a37c7b59c95067d74f35f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pessoa" ADD CONSTRAINT "FK_588452ad41dec0e31cb096dd418" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tecnico" ADD CONSTRAINT "FK_7c755ba13912380914d2f35d035" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tecnico" DROP CONSTRAINT "FK_7c755ba13912380914d2f35d035"`);
        await queryRunner.query(`ALTER TABLE "pessoa" DROP CONSTRAINT "FK_588452ad41dec0e31cb096dd418"`);
        await queryRunner.query(`DROP TABLE "tecnico"`);
        await queryRunner.query(`DROP TABLE "equipe"`);
        await queryRunner.query(`DROP TABLE "pessoa"`);
        await queryRunner.query(`DROP TYPE "public"."pessoa_tipo_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pessoa_genero_enum"`);
    }

}
