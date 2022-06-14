import { MigrationInterface, QueryRunner } from 'typeorm';

export class CascadeAll21655208308702 implements MigrationInterface {
  name = 'CascadeAll21655208308702';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "delegados" DROP CONSTRAINT "FK_8641a46be0659ebefd28a998956"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_de94a09c62e98501363519b05cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_e0872826715a9d03d6e1bcdbb14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_2dcc30b378f8e69aedb263a0465"`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros" DROP CONSTRAINT "FK_fe99de4c16afb87c570c956b2bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tecnicos" DROP CONSTRAINT "FK_726c77443629b22dc96a8ef714d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes" DROP CONSTRAINT "FK_b5b45eae06b288f11e5b3fcc38e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "delegados" DROP CONSTRAINT "REL_8641a46be0659ebefd28a99895"`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros" DROP CONSTRAINT "REL_fe99de4c16afb87c570c956b2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "delegados" ADD CONSTRAINT "FK_8641a46be0659ebefd28a998956" FOREIGN KEY ("id_liga") REFERENCES "ligas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_de94a09c62e98501363519b05cf" FOREIGN KEY ("id_delegado") REFERENCES "delegados"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_e0872826715a9d03d6e1bcdbb14" FOREIGN KEY ("id_ginasio") REFERENCES "ginasios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_2dcc30b378f8e69aedb263a0465" FOREIGN KEY ("id_ganhadora") REFERENCES "equipes_partidas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros" ADD CONSTRAINT "FK_fe99de4c16afb87c570c956b2bf" FOREIGN KEY ("id_liga") REFERENCES "ligas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tecnicos" ADD CONSTRAINT "FK_726c77443629b22dc96a8ef714d" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes" ADD CONSTRAINT "FK_b5b45eae06b288f11e5b3fcc38e" FOREIGN KEY ("id_ginasio") REFERENCES "ginasios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "equipes" DROP CONSTRAINT "FK_b5b45eae06b288f11e5b3fcc38e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tecnicos" DROP CONSTRAINT "FK_726c77443629b22dc96a8ef714d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros" DROP CONSTRAINT "FK_fe99de4c16afb87c570c956b2bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_4a4d635b2764920256ef9e33c4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_2dcc30b378f8e69aedb263a0465"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_e0872826715a9d03d6e1bcdbb14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_de94a09c62e98501363519b05cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "delegados" DROP CONSTRAINT "FK_8641a46be0659ebefd28a998956"`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros" ADD CONSTRAINT "REL_fe99de4c16afb87c570c956b2b" UNIQUE ("id_liga")`,
    );
    await queryRunner.query(
      `ALTER TABLE "delegados" ADD CONSTRAINT "REL_8641a46be0659ebefd28a99895" UNIQUE ("id_liga")`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes" ADD CONSTRAINT "FK_b5b45eae06b288f11e5b3fcc38e" FOREIGN KEY ("id_ginasio") REFERENCES "ginasios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tecnicos" ADD CONSTRAINT "FK_726c77443629b22dc96a8ef714d" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros" ADD CONSTRAINT "FK_fe99de4c16afb87c570c956b2bf" FOREIGN KEY ("id_liga") REFERENCES "ligas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_2dcc30b378f8e69aedb263a0465" FOREIGN KEY ("id_ganhadora") REFERENCES "equipes_partidas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_e0872826715a9d03d6e1bcdbb14" FOREIGN KEY ("id_ginasio") REFERENCES "ginasios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_de94a09c62e98501363519b05cf" FOREIGN KEY ("id_delegado") REFERENCES "delegados"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "delegados" ADD CONSTRAINT "FK_8641a46be0659ebefd28a998956" FOREIGN KEY ("id_liga") REFERENCES "ligas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
