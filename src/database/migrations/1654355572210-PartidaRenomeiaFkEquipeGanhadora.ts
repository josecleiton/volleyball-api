import {MigrationInterface, QueryRunner} from "typeorm";

export class PartidaRenomeiaFkEquipeGanhadora1654355572210 implements MigrationInterface {
    name = 'PartidaRenomeiaFkEquipeGanhadora1654355572210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partidas" DROP CONSTRAINT "FK_2156f57a412039f3e0ccb951a21"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2156f57a412039f3e0ccb951a2"`);
        await queryRunner.query(`ALTER TABLE "partidas" RENAME COLUMN "id_equipe_ganhador" TO "id_equipe_ganhadora"`);
        await queryRunner.query(`CREATE INDEX "IDX_98b9592061b55759e443f83c8f" ON "partidas" ("id_equipe_ganhadora") `);
        await queryRunner.query(`ALTER TABLE "partidas" ADD CONSTRAINT "FK_98b9592061b55759e443f83c8fb" FOREIGN KEY ("id_equipe_ganhadora") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partidas" DROP CONSTRAINT "FK_98b9592061b55759e443f83c8fb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_98b9592061b55759e443f83c8f"`);
        await queryRunner.query(`ALTER TABLE "partidas" RENAME COLUMN "id_equipe_ganhadora" TO "id_equipe_ganhador"`);
        await queryRunner.query(`CREATE INDEX "IDX_2156f57a412039f3e0ccb951a2" ON "partidas" ("id_equipe_ganhador") `);
        await queryRunner.query(`ALTER TABLE "partidas" ADD CONSTRAINT "FK_2156f57a412039f3e0ccb951a21" FOREIGN KEY ("id_equipe_ganhador") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
