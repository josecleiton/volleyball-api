import {MigrationInterface, QueryRunner} from "typeorm";

export class CriaGinasio1653265198722 implements MigrationInterface {
    name = 'CriaGinasio1653265198722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ginasios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "nome" character varying NOT NULL, "cidade" character varying NOT NULL, "estado" character varying NOT NULL, CONSTRAINT "UQ_ginasios_nome_cidade_estado" UNIQUE ("nome", "cidade", "estado"), CONSTRAINT "PK_930dd1915a2b4d5865733a462df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bd0a9b6e5a48419ff3e660f742" ON "ginasios" ("data_criacao") `);
        await queryRunner.query(`CREATE INDEX "IDX_a41964d39d213e87c0f2e40321" ON "ginasios" ("cidade") `);
        await queryRunner.query(`CREATE INDEX "IDX_3120d2ed6a2db074dc8673ba40" ON "ginasios" ("estado") `);
        await queryRunner.query(`CREATE INDEX "IX_ginasios_cidade_estado" ON "ginasios" ("cidade", "estado") `);
        await queryRunner.query(`ALTER TABLE "equipes" ADD "id_ginasio" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "equipes" ADD CONSTRAINT "UQ_b5b45eae06b288f11e5b3fcc38e" UNIQUE ("id_ginasio")`);
        await queryRunner.query(`ALTER TABLE "equipes" ADD CONSTRAINT "FK_b5b45eae06b288f11e5b3fcc38e" FOREIGN KEY ("id_ginasio") REFERENCES "ginasios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "equipes" DROP CONSTRAINT "FK_b5b45eae06b288f11e5b3fcc38e"`);
        await queryRunner.query(`ALTER TABLE "equipes" DROP CONSTRAINT "UQ_b5b45eae06b288f11e5b3fcc38e"`);
        await queryRunner.query(`ALTER TABLE "equipes" DROP COLUMN "id_ginasio"`);
        await queryRunner.query(`DROP INDEX "public"."IX_ginasios_cidade_estado"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3120d2ed6a2db074dc8673ba40"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a41964d39d213e87c0f2e40321"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bd0a9b6e5a48419ff3e660f742"`);
        await queryRunner.query(`DROP TABLE "ginasios"`);
    }

}
