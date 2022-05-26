import {MigrationInterface, QueryRunner} from "typeorm";

export class AnoPelaComeçoData1653524729987 implements MigrationInterface {
    name = 'AnoPelaComeçoData1653524729987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ligas" DROP CONSTRAINT "UQ_f617772a0e0c361dccec6f32bc0"`);
        await queryRunner.query(`ALTER TABLE "ligas" DROP COLUMN "ano"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ligas" ADD "ano" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ligas" ADD CONSTRAINT "UQ_f617772a0e0c361dccec6f32bc0" UNIQUE ("genero", "serie", "ano")`);
    }

}
