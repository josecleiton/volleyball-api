import {MigrationInterface, QueryRunner} from "typeorm";

export class LigaRenomeiaEstadoParaStatus1654366866798 implements MigrationInterface {
    name = 'LigaRenomeiaEstadoParaStatus1654366866798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ligas" RENAME COLUMN "estado" TO "status"`);
        await queryRunner.query(`ALTER TYPE "public"."ligas_estado_enum" RENAME TO "ligas_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."ligas_status_enum" RENAME TO "ligas_estado_enum"`);
        await queryRunner.query(`ALTER TABLE "ligas" RENAME COLUMN "status" TO "estado"`);
    }

}
