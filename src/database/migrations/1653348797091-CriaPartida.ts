import {MigrationInterface, QueryRunner} from "typeorm";

export class CriaPartida1653348797091 implements MigrationInterface {
    name = 'CriaPartida1653348797091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."partida_status_enum" AS ENUM('agendada', 'em_andamento', 'concluida')`);
        await queryRunner.query(`CREATE TABLE "partida" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "id_delegado" uuid NOT NULL, "id_arbitro" uuid NOT NULL, "id_ginasio" uuid NOT NULL, "id_mandante" uuid NOT NULL, "id_visitante" uuid NOT NULL, "status" "public"."partida_status_enum" NOT NULL, "data_comeco" TIMESTAMP, "data_finalizacao" TIMESTAMP, "id_equipe_ganhador" uuid, "id_equipe_visitante" uuid, "id_equipe_mandante" uuid, CONSTRAINT "PK_10d41cde1840f4c9d8c44d245af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_80624df2e95d2b7623c664320a" ON "partida" ("data_criacao") `);
        await queryRunner.query(`CREATE INDEX "IDX_b1bd47176a7f10bd46ca9f05a4" ON "partida" ("id_delegado") `);
        await queryRunner.query(`CREATE INDEX "IDX_ee13a094c4e39221da29a3da96" ON "partida" ("id_arbitro") `);
        await queryRunner.query(`CREATE INDEX "IDX_e6a9ba90a85856373a5451646f" ON "partida" ("id_ginasio") `);
        await queryRunner.query(`CREATE INDEX "IDX_25924b76c32d7116b1e92c1008" ON "partida" ("id_mandante") `);
        await queryRunner.query(`CREATE INDEX "IDX_7185ece84a7a2eabc6b18dc880" ON "partida" ("id_visitante") `);
        await queryRunner.query(`CREATE INDEX "IDX_c6bef5283d72d0e16f168be2b0" ON "partida" ("id_equipe_ganhador") `);
        await queryRunner.query(`ALTER TABLE "partida" ADD CONSTRAINT "FK_b1bd47176a7f10bd46ca9f05a40" FOREIGN KEY ("id_delegado") REFERENCES "delegados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partida" ADD CONSTRAINT "FK_ee13a094c4e39221da29a3da96e" FOREIGN KEY ("id_arbitro") REFERENCES "arbitros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partida" ADD CONSTRAINT "FK_e6a9ba90a85856373a5451646ff" FOREIGN KEY ("id_ginasio") REFERENCES "ginasios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partida" ADD CONSTRAINT "FK_c6bef5283d72d0e16f168be2b0c" FOREIGN KEY ("id_equipe_ganhador") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partida" ADD CONSTRAINT "FK_b728812615ed4c64edd07b00fb4" FOREIGN KEY ("id_equipe_visitante") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partida" ADD CONSTRAINT "FK_ebae47a21a51ac768d12dce4d2e" FOREIGN KEY ("id_equipe_mandante") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partida" DROP CONSTRAINT "FK_ebae47a21a51ac768d12dce4d2e"`);
        await queryRunner.query(`ALTER TABLE "partida" DROP CONSTRAINT "FK_b728812615ed4c64edd07b00fb4"`);
        await queryRunner.query(`ALTER TABLE "partida" DROP CONSTRAINT "FK_c6bef5283d72d0e16f168be2b0c"`);
        await queryRunner.query(`ALTER TABLE "partida" DROP CONSTRAINT "FK_e6a9ba90a85856373a5451646ff"`);
        await queryRunner.query(`ALTER TABLE "partida" DROP CONSTRAINT "FK_ee13a094c4e39221da29a3da96e"`);
        await queryRunner.query(`ALTER TABLE "partida" DROP CONSTRAINT "FK_b1bd47176a7f10bd46ca9f05a40"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6bef5283d72d0e16f168be2b0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7185ece84a7a2eabc6b18dc880"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25924b76c32d7116b1e92c1008"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e6a9ba90a85856373a5451646f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ee13a094c4e39221da29a3da96"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b1bd47176a7f10bd46ca9f05a4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_80624df2e95d2b7623c664320a"`);
        await queryRunner.query(`DROP TABLE "partida"`);
        await queryRunner.query(`DROP TYPE "public"."partida_status_enum"`);
    }

}
