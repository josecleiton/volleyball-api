import {MigrationInterface, QueryRunner} from "typeorm";

export class AlteraPartidaEntity1653391232553 implements MigrationInterface {
    name = 'AlteraPartidaEntity1653391232553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partida" DROP CONSTRAINT "FK_b1bd47176a7f10bd46ca9f05a40"`);
        await queryRunner.query(`ALTER TABLE "partida" DROP CONSTRAINT "FK_ee13a094c4e39221da29a3da96e"`);
        await queryRunner.query(`ALTER TABLE "partida" ALTER COLUMN "id_delegado" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partida" ALTER COLUMN "id_arbitro" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partida" ALTER COLUMN "status" SET DEFAULT 'agendada'`);
        await queryRunner.query(`ALTER TABLE "partida" ALTER COLUMN "data_comeco" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partida" ADD CONSTRAINT "FK_b1bd47176a7f10bd46ca9f05a40" FOREIGN KEY ("id_delegado") REFERENCES "delegados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partida" ADD CONSTRAINT "FK_ee13a094c4e39221da29a3da96e" FOREIGN KEY ("id_arbitro") REFERENCES "arbitros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partida" DROP CONSTRAINT "FK_ee13a094c4e39221da29a3da96e"`);
        await queryRunner.query(`ALTER TABLE "partida" DROP CONSTRAINT "FK_b1bd47176a7f10bd46ca9f05a40"`);
        await queryRunner.query(`ALTER TABLE "partida" ALTER COLUMN "data_comeco" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partida" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "partida" ALTER COLUMN "id_arbitro" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partida" ALTER COLUMN "id_delegado" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "partida" ADD CONSTRAINT "FK_ee13a094c4e39221da29a3da96e" FOREIGN KEY ("id_arbitro") REFERENCES "arbitros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partida" ADD CONSTRAINT "FK_b1bd47176a7f10bd46ca9f05a40" FOREIGN KEY ("id_delegado") REFERENCES "delegados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
