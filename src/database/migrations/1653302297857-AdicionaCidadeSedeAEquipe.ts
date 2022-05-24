import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdicionaCidadeSedeAEquipe1653302297857
  implements MigrationInterface
{
  name = 'AdicionaCidadeSedeAEquipe1653302297857';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "equipes" ADD "estado" character varying(20) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes" ADD "cidade" character varying NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IX_equipes_cidade_estado" ON "equipes" ("cidade", "estado") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IX_equipes_cidade_estado"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_726c77443629b22dc96a8ef714"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_442b67bb04c95a2e04ebbbd83b"`,
    );
    await queryRunner.query(`ALTER TABLE "equipes" DROP COLUMN "cidade"`);
    await queryRunner.query(`ALTER TABLE "equipes" DROP COLUMN "estado"`);
  }
}
