import {MigrationInterface, QueryRunner} from "typeorm";

export class CriaLiga1652972713631 implements MigrationInterface {
    name = 'CriaLiga1652972713631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ligas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "genero" character varying NOT NULL, "iniciada_em" TIMESTAMP WITH TIME ZONE, "nome" character varying, "serie" character varying(40), "ano" character varying NOT NULL, CONSTRAINT "UQ_f617772a0e0c361dccec6f32bc0" UNIQUE ("ano", "genero", "serie"), CONSTRAINT "PK_461f18cdc237818a4d9f2cebc9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2ddf9d216ffb580e40f3e920f0" ON "ligas" ("data_criacao") `);
        await queryRunner.query(`ALTER TABLE "equipes" ADD "id_liga" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_2551905023f3f38587bafb7395" ON "pessoas" ("data_criacao") `);
        await queryRunner.query(`CREATE INDEX "IDX_06c48d7d3c0caecaeba906369a" ON "tecnicos" ("data_criacao") `);
        await queryRunner.query(`CREATE INDEX "IDX_d5b91bb370c911d7060b3b888a" ON "equipes" ("data_criacao") `);
        await queryRunner.query(`CREATE INDEX "IDX_dbd8279a19c9d8626420d6a62e" ON "atletas" ("data_criacao") `);
        await queryRunner.query(`ALTER TABLE "equipes" ADD CONSTRAINT "FK_c889de707e36b235a08c65e41ca" FOREIGN KEY ("id_liga") REFERENCES "ligas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "equipes" DROP CONSTRAINT "FK_c889de707e36b235a08c65e41ca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dbd8279a19c9d8626420d6a62e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d5b91bb370c911d7060b3b888a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_06c48d7d3c0caecaeba906369a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2551905023f3f38587bafb7395"`);
        await queryRunner.query(`ALTER TABLE "equipes" DROP COLUMN "id_liga"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2ddf9d216ffb580e40f3e920f0"`);
        await queryRunner.query(`DROP TABLE "ligas"`);
    }

}
