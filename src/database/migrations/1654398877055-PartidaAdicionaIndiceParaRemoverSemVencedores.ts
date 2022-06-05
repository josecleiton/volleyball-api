import {MigrationInterface, QueryRunner} from "typeorm";

export class PartidaAdicionaIndiceParaRemoverSemVencedores1654398877055 implements MigrationInterface {
    name = 'PartidaAdicionaIndiceParaRemoverSemVencedores1654398877055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IX_partidas_RemovePartidasSemVencedores" ON "partidas" ("status") WHERE id_equipe_ganhadora IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IX_partidas_RemovePartidasSemVencedores"`);
    }

}
