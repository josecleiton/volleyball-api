import {MigrationInterface, QueryRunner} from "typeorm";

export class AjustaRelacoes1653437242729 implements MigrationInterface {
    name = 'AjustaRelacoes1653437242729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_fc7c183cc252c03be21fd920e6"`);
        await queryRunner.query(`ALTER TABLE "auxiliares" RENAME COLUMN "tipo" TO "tipo_auxiliar"`);
        await queryRunner.query(`ALTER TYPE "public"."auxiliares_tipo_enum" RENAME TO "auxiliares_tipo_auxiliar_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pessoas_tipo_enum" RENAME TO "pessoas_tipo_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."pessoas_tipo_enum" AS ENUM('arbitro', 'tecnico', 'atleta', 'auxiliar', 'delegado')`);
        await queryRunner.query(`ALTER TABLE "pessoas" ALTER COLUMN "tipo" TYPE "public"."pessoas_tipo_enum" USING "tipo"::"text"::"public"."pessoas_tipo_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pessoas_tipo_enum_old"`);
        await queryRunner.query(`ALTER TABLE "tecnicos" DROP CONSTRAINT "FK_726c77443629b22dc96a8ef714d"`);
        await queryRunner.query(`ALTER TABLE "tecnicos" ADD CONSTRAINT "UQ_726c77443629b22dc96a8ef714d" UNIQUE ("id_equipe")`);
        await queryRunner.query(`CREATE INDEX "IDX_0297b00b2149a7d35118c14674" ON "auxiliares" ("tipo_auxiliar") `);
        await queryRunner.query(`ALTER TABLE "tecnicos" ADD CONSTRAINT "FK_726c77443629b22dc96a8ef714d" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tecnicos" DROP CONSTRAINT "FK_726c77443629b22dc96a8ef714d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0297b00b2149a7d35118c14674"`);
        await queryRunner.query(`ALTER TABLE "tecnicos" DROP CONSTRAINT "UQ_726c77443629b22dc96a8ef714d"`);
        await queryRunner.query(`ALTER TABLE "tecnicos" ADD CONSTRAINT "FK_726c77443629b22dc96a8ef714d" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TYPE "public"."pessoas_tipo_enum_old" AS ENUM('tecnico', 'atleta', 'auxiliar')`);
        await queryRunner.query(`ALTER TABLE "pessoas" ALTER COLUMN "tipo" TYPE "public"."pessoas_tipo_enum_old" USING "tipo"::"text"::"public"."pessoas_tipo_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."pessoas_tipo_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pessoas_tipo_enum_old" RENAME TO "pessoas_tipo_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."auxiliares_tipo_auxiliar_enum" RENAME TO "auxiliares_tipo_enum"`);
        await queryRunner.query(`ALTER TABLE "auxiliares" RENAME COLUMN "tipo_auxiliar" TO "tipo"`);
        await queryRunner.query(`CREATE INDEX "IDX_fc7c183cc252c03be21fd920e6" ON "auxiliares" ("tipo") `);
    }

}