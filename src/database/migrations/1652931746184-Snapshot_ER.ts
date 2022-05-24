import {MigrationInterface, QueryRunner} from "typeorm";

export class SnapshotER1652931746184 implements MigrationInterface {
    name = 'SnapshotER1652931746184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pessoas_genero_enum" AS ENUM('feminino', 'masculino')`);
        await queryRunner.query(`CREATE TYPE "public"."pessoas_tipo_enum" AS ENUM('tecnico', 'atleta', 'auxiliar')`);
        await queryRunner.query(`CREATE TABLE "pessoas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "documento" character varying(50) NOT NULL, "genero" "public"."pessoas_genero_enum" NOT NULL, "data_nascimento" TIMESTAMP NOT NULL, "documento_cbv" character varying(50) NOT NULL, "tipo" "public"."pessoas_tipo_enum" NOT NULL, CONSTRAINT "UQ_c1ab3438a61435fd355c673303f" UNIQUE ("documento_cbv"), CONSTRAINT "PK_fa8104cfc91dc207880a73a1acd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."atletas_posicao_enum" AS ENUM('ponta', 'oposto', 'central', 'libero', 'levantador')`);
        await queryRunner.query(`CREATE TABLE "atletas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "id_pessoa" uuid NOT NULL, "id_equipe" uuid NOT NULL, "posicao" "public"."atletas_posicao_enum" NOT NULL, "numero" smallint NOT NULL, CONSTRAINT "UQ_8673430de4ae5ab7edf8dba98c1" UNIQUE ("id_pessoa"), CONSTRAINT "UQ_atletas_numero_por_equipe" UNIQUE ("numero", "id_equipe"), CONSTRAINT "REL_8673430de4ae5ab7edf8dba98c" UNIQUE ("id_pessoa"), CONSTRAINT "PK_209e4ca399219bce544fac44dec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tecnicos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "id_pessoa" uuid NOT NULL, "id_equipe" uuid NOT NULL, "documento_cref" character varying(50) NOT NULL, CONSTRAINT "UQ_606c789ebbaf0670a39edf937c3" UNIQUE ("id_pessoa"), CONSTRAINT "UQ_5630f0084bc92ed174b3d85f2ac" UNIQUE ("documento_cref"), CONSTRAINT "REL_606c789ebbaf0670a39edf937c" UNIQUE ("id_pessoa"), CONSTRAINT "PK_57a82263172b130f3dafce11faa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "equipes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "url_brasao" character varying, "apta" boolean NOT NULL DEFAULT false, "descricao_aptidao" jsonb, CONSTRAINT "UQ_c107f0e64f7eaa9e02e37ba147d" UNIQUE ("nome"), CONSTRAINT "PK_9f0bfc492ee9542b0c0f42eb21d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "atletas" ADD CONSTRAINT "FK_8673430de4ae5ab7edf8dba98c1" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "atletas" ADD CONSTRAINT "FK_442b67bb04c95a2e04ebbbd83be" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tecnicos" ADD CONSTRAINT "FK_606c789ebbaf0670a39edf937c3" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tecnicos" ADD CONSTRAINT "FK_726c77443629b22dc96a8ef714d" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tecnicos" DROP CONSTRAINT "FK_726c77443629b22dc96a8ef714d"`);
        await queryRunner.query(`ALTER TABLE "tecnicos" DROP CONSTRAINT "FK_606c789ebbaf0670a39edf937c3"`);
        await queryRunner.query(`ALTER TABLE "atletas" DROP CONSTRAINT "FK_442b67bb04c95a2e04ebbbd83be"`);
        await queryRunner.query(`ALTER TABLE "atletas" DROP CONSTRAINT "FK_8673430de4ae5ab7edf8dba98c1"`);
        await queryRunner.query(`DROP TABLE "equipes"`);
        await queryRunner.query(`DROP TABLE "tecnicos"`);
        await queryRunner.query(`DROP TABLE "atletas"`);
        await queryRunner.query(`DROP TYPE "public"."atletas_posicao_enum"`);
        await queryRunner.query(`DROP TABLE "pessoas"`);
        await queryRunner.query(`DROP TYPE "public"."pessoas_tipo_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pessoas_genero_enum"`);
    }

}
