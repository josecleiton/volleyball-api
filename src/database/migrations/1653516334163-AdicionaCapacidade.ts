import {MigrationInterface, QueryRunner} from "typeorm";

export class AdicionaCapacidade1653516334163 implements MigrationInterface {
    name = 'AdicionaCapacidade1653516334163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ginasios" ADD "capacidade" integer NOT NULL DEFAULT '1000'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ginasios" DROP COLUMN "capacidade"`);
    }

}
