import { MigrationInterface, QueryRunner } from 'typeorm';

export class CriaVotoDaGalera1654857614503 implements MigrationInterface {
  name = 'CriaVotoDaGalera1654857614503';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "votos_da_galera" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "data_atualizacao" TIMESTAMP NOT NULL DEFAULT now(), "data_criacao" TIMESTAMP NOT NULL DEFAULT now(), "id_atleta" uuid NOT NULL, "telefone" character varying NOT NULL, "id_verificacao" character varying NOT NULL, "verificado_em" TIMESTAMP, "verificacao_expira_em" TIMESTAMP NOT NULL, CONSTRAINT "UQ_2aff92fd5886c18acd681d629e3" UNIQUE ("id_verificacao"), CONSTRAINT "UQ_52c258f86b81bb4905343bc8498" UNIQUE ("id_atleta", "telefone"), CONSTRAINT "PK_a82aee84e7ffb11cd8aadd3acf7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4575175bdc00568e84f60058b4" ON "votos_da_galera" ("data_criacao") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c3d7984e89fc1bc852dfb62484" ON "votos_da_galera" ("telefone", "verificado_em") `,
    );
    await queryRunner.query(
      `ALTER TABLE "votos_da_galera" ADD CONSTRAINT "FK_43c84e78723e7f2a80af90cd9fb" FOREIGN KEY ("id_atleta") REFERENCES "atletas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "votos_da_galera" DROP CONSTRAINT "FK_43c84e78723e7f2a80af90cd9fb"`,
    );
    await queryRunner.query(`DROP TABLE "votos_da_galera"`);
  }
}
