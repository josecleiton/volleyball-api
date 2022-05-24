import {MigrationInterface, QueryRunner} from "typeorm";

export class CriaIndiceEmIdEquipe1653301746629 implements MigrationInterface {
    name = 'CriaIndiceEmIdEquipe1653301746629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_442b67bb04c95a2e04ebbbd83b" ON "atletas" ("id_equipe") `);
        await queryRunner.query(`CREATE INDEX "IDX_726c77443629b22dc96a8ef714" ON "tecnicos" ("id_equipe") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_726c77443629b22dc96a8ef714"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_442b67bb04c95a2e04ebbbd83b"`);
    }

}
