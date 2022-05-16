import { MigrationInterface, QueryRunner } from 'typeorm';

export class EquipePessoaTecnico1652702024699 implements MigrationInterface {
  name = 'EquipePessoaTecnico1652702024699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."pessoa_genero_enum" AS ENUM('feminino', 'masculino')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."pessoa_tipo_enum" AS ENUM('tecnico', 'atleta', 'auxiliar')`,
    );
    await queryRunner.query(
      `CREATE TABLE "pessoa" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "documento" character varying(50) NOT NULL, "genero" "public"."pessoa_genero_enum" NOT NULL, "idade" smallint NOT NULL, "documento_cbv" character varying(50) NOT NULL, "tipo" "public"."pessoa_tipo_enum" NOT NULL, CONSTRAINT "UQ_b2970aba5cf13df8f618b48a0ca" UNIQUE ("documento_cbv"), CONSTRAINT "PK_bb879ac36994545a5a917a09ba5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tecnico" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "documento_cref" character varying(50) NOT NULL, "id_equipe" uuid NOT NULL, "id_pessoa" uuid, CONSTRAINT "UQ_61014a82d3d115667b06f6b555a" UNIQUE ("documento_cref"), CONSTRAINT "REL_984115bd4e33e4a1e850f60221" UNIQUE ("id_pessoa"), CONSTRAINT "REL_47198f5d4b8f2982d98186bdc3" UNIQUE ("id_equipe"), CONSTRAINT "PK_7add9a37c7b59c95067d74f35f6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "equipe" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "url_brasao" character varying, "apta" boolean NOT NULL DEFAULT false, "descricao_aptidao" jsonb, CONSTRAINT "UQ_cb6e5b555ff5d41394edc5f2b5b" UNIQUE ("nome"), CONSTRAINT "PK_f2503347d661dac29b5a0035f22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tecnico" ADD CONSTRAINT "FK_984115bd4e33e4a1e850f602212" FOREIGN KEY ("id_pessoa") REFERENCES "pessoa"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tecnico" ADD CONSTRAINT "FK_47198f5d4b8f2982d98186bdc30" FOREIGN KEY ("id_equipe") REFERENCES "equipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tecnico" DROP CONSTRAINT "FK_47198f5d4b8f2982d98186bdc30"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tecnico" DROP CONSTRAINT "FK_984115bd4e33e4a1e850f602212"`,
    );
    await queryRunner.query(`DROP TABLE "equipe"`);
    await queryRunner.query(`DROP TABLE "tecnico"`);
    await queryRunner.query(`DROP TABLE "pessoa"`);
    await queryRunner.query(`DROP TYPE "public"."pessoa_tipo_enum"`);
    await queryRunner.query(`DROP TYPE "public"."pessoa_genero_enum"`);
  }
}
