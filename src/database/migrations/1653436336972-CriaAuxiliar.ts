import {MigrationInterface, QueryRunner} from "typeorm";

export class CriaAuxiliar1653436336972 implements MigrationInterface {
    name = 'CriaAuxiliar1653436336972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."auxiliares_tipo_enum" AS ENUM('assistente_medico', 'auxiliar_tecnico', 'preparador_fisico', 'fisioterapeuta', 'medico', 'massagista')`);
        await queryRunner.query(`CREATE TABLE "auxiliares" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "id_pessoa" uuid NOT NULL, "id_equipe" uuid NOT NULL, "tipo" "public"."auxiliares_tipo_enum" NOT NULL, "documento_cref" character varying(50) NOT NULL, CONSTRAINT "UQ_63186f3f51e662a98fb04c176b7" UNIQUE ("id_pessoa"), CONSTRAINT "UQ_e936074a7758778e997d1214b82" UNIQUE ("documento_cref"), CONSTRAINT "REL_63186f3f51e662a98fb04c176b" UNIQUE ("id_pessoa"), CONSTRAINT "PK_2ecfd0cd470ecf689bc62abd335" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fd2a1f231e268d846f86915865" ON "auxiliares" ("data_criacao") `);
        await queryRunner.query(`CREATE INDEX "IDX_185c120f3624970475d8f1df84" ON "auxiliares" ("id_equipe") `);
        await queryRunner.query(`CREATE INDEX "IDX_fc7c183cc252c03be21fd920e6" ON "auxiliares" ("tipo") `);
        await queryRunner.query(`ALTER TABLE "auxiliares" ADD CONSTRAINT "FK_63186f3f51e662a98fb04c176b7" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auxiliares" ADD CONSTRAINT "FK_185c120f3624970475d8f1df84b" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auxiliares" DROP CONSTRAINT "FK_185c120f3624970475d8f1df84b"`);
        await queryRunner.query(`ALTER TABLE "auxiliares" DROP CONSTRAINT "FK_63186f3f51e662a98fb04c176b7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fc7c183cc252c03be21fd920e6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_185c120f3624970475d8f1df84"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd2a1f231e268d846f86915865"`);
        await queryRunner.query(`DROP TABLE "auxiliares"`);
        await queryRunner.query(`DROP TYPE "public"."auxiliares_tipo_enum"`);
    }

}