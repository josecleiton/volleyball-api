import {MigrationInterface, QueryRunner} from "typeorm";

export class CriaArbitroEDelegado1653304126875 implements MigrationInterface {
    name = 'CriaArbitroEDelegado1653304126875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "delegados" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "id_pessoa" uuid NOT NULL, "id_liga" uuid NOT NULL, CONSTRAINT "UQ_a2b5b0b570956c36475eeb066c3" UNIQUE ("id_pessoa"), CONSTRAINT "REL_a2b5b0b570956c36475eeb066c" UNIQUE ("id_pessoa"), CONSTRAINT "REL_8641a46be0659ebefd28a99895" UNIQUE ("id_liga"), CONSTRAINT "PK_17a4a565077e2739d85da5a5afd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ebef46b3cc90c2843167a4d5f4" ON "delegados" ("data_criacao") `);
        await queryRunner.query(`CREATE INDEX "IDX_8641a46be0659ebefd28a99895" ON "delegados" ("id_liga") `);
        await queryRunner.query(`CREATE TABLE "arbitros" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "id_pessoa" uuid NOT NULL, "id_liga" uuid NOT NULL, CONSTRAINT "UQ_7175f8ecb699effccd191c530d3" UNIQUE ("id_pessoa"), CONSTRAINT "REL_7175f8ecb699effccd191c530d" UNIQUE ("id_pessoa"), CONSTRAINT "REL_fe99de4c16afb87c570c956b2b" UNIQUE ("id_liga"), CONSTRAINT "PK_628ab77296ad7f03e340ba72406" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5cc47f6d67b56b3f1b6024548d" ON "arbitros" ("data_criacao") `);
        await queryRunner.query(`CREATE INDEX "IDX_fe99de4c16afb87c570c956b2b" ON "arbitros" ("id_liga") `);
        await queryRunner.query(`ALTER TABLE "delegados" ADD CONSTRAINT "FK_a2b5b0b570956c36475eeb066c3" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delegados" ADD CONSTRAINT "FK_8641a46be0659ebefd28a998956" FOREIGN KEY ("id_liga") REFERENCES "ligas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "arbitros" ADD CONSTRAINT "FK_7175f8ecb699effccd191c530d3" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "arbitros" ADD CONSTRAINT "FK_fe99de4c16afb87c570c956b2bf" FOREIGN KEY ("id_liga") REFERENCES "ligas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "arbitros" DROP CONSTRAINT "FK_fe99de4c16afb87c570c956b2bf"`);
        await queryRunner.query(`ALTER TABLE "arbitros" DROP CONSTRAINT "FK_7175f8ecb699effccd191c530d3"`);
        await queryRunner.query(`ALTER TABLE "delegados" DROP CONSTRAINT "FK_8641a46be0659ebefd28a998956"`);
        await queryRunner.query(`ALTER TABLE "delegados" DROP CONSTRAINT "FK_a2b5b0b570956c36475eeb066c3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe99de4c16afb87c570c956b2b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5cc47f6d67b56b3f1b6024548d"`);
        await queryRunner.query(`DROP TABLE "arbitros"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8641a46be0659ebefd28a99895"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ebef46b3cc90c2843167a4d5f4"`);
        await queryRunner.query(`DROP TABLE "delegados"`);
    }

}
