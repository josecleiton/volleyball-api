import { MigrationInterface, QueryRunner } from 'typeorm';

export class CascadeAll1655171226824 implements MigrationInterface {
  name = 'CascadeAll1655171226824';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "delegados" DROP CONSTRAINT "FK_a2b5b0b570956c36475eeb066c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas" DROP CONSTRAINT "FK_442b67bb04c95a2e04ebbbd83be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas" DROP CONSTRAINT "FK_8673430de4ae5ab7edf8dba98c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas_escalados" DROP CONSTRAINT "FK_f72a0deda9a05fa5079ebaf7d3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas_escalados" DROP CONSTRAINT "FK_aff09371e8b4aedd2d46ef1121e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" DROP CONSTRAINT "FK_b38dc0d6c02b7dc8d01243694fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" DROP CONSTRAINT "FK_b619e7a5725eaaf9ec76efbc0ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_e343fae9dfdbb61550a5b7e26e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_55307682a97abeecbe78ef95e2b"`,
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
      `ALTER TABLE "arbitros_partida" DROP CONSTRAINT "FK_f2e52bb8b002c915b80af6bad60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros_partida" DROP CONSTRAINT "FK_756f1be552d523d58d73102dae1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros" DROP CONSTRAINT "FK_7175f8ecb699effccd191c530d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tecnicos" DROP CONSTRAINT "FK_606c789ebbaf0670a39edf937c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auxiliares" DROP CONSTRAINT "FK_185c120f3624970475d8f1df84b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auxiliares" DROP CONSTRAINT "FK_63186f3f51e662a98fb04c176b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes" DROP CONSTRAINT "FK_b5b45eae06b288f11e5b3fcc38e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes" DROP CONSTRAINT "FK_c889de707e36b235a08c65e41ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" DROP CONSTRAINT "FK_449fe4c78fb88327cd9e94c544e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "votos_da_galera" DROP CONSTRAINT "FK_43c84e78723e7f2a80af90cd9fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "delegados" ADD CONSTRAINT "FK_a2b5b0b570956c36475eeb066c3" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas" ADD CONSTRAINT "FK_8673430de4ae5ab7edf8dba98c1" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas" ADD CONSTRAINT "FK_442b67bb04c95a2e04ebbbd83be" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas_escalados" ADD CONSTRAINT "FK_aff09371e8b4aedd2d46ef1121e" FOREIGN KEY ("id_equipe_partida") REFERENCES "equipes_partidas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas_escalados" ADD CONSTRAINT "FK_f72a0deda9a05fa5079ebaf7d3e" FOREIGN KEY ("id_atleta") REFERENCES "atletas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ADD CONSTRAINT "FK_b619e7a5725eaaf9ec76efbc0ff" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ADD CONSTRAINT "FK_b38dc0d6c02b7dc8d01243694fe" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_de94a09c62e98501363519b05cf" FOREIGN KEY ("id_delegado") REFERENCES "delegados"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_e0872826715a9d03d6e1bcdbb14" FOREIGN KEY ("id_ginasio") REFERENCES "ginasios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_2dcc30b378f8e69aedb263a0465" FOREIGN KEY ("id_ganhadora") REFERENCES "equipes_partidas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_55307682a97abeecbe78ef95e2b" FOREIGN KEY ("id_visitante") REFERENCES "equipes_partidas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_e343fae9dfdbb61550a5b7e26e7" FOREIGN KEY ("id_mandante") REFERENCES "equipes_partidas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros_partida" ADD CONSTRAINT "FK_756f1be552d523d58d73102dae1" FOREIGN KEY ("id_arbitro") REFERENCES "arbitros"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros_partida" ADD CONSTRAINT "FK_f2e52bb8b002c915b80af6bad60" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros" ADD CONSTRAINT "FK_7175f8ecb699effccd191c530d3" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tecnicos" ADD CONSTRAINT "FK_606c789ebbaf0670a39edf937c3" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auxiliares" ADD CONSTRAINT "FK_63186f3f51e662a98fb04c176b7" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auxiliares" ADD CONSTRAINT "FK_185c120f3624970475d8f1df84b" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes" ADD CONSTRAINT "FK_c889de707e36b235a08c65e41ca" FOREIGN KEY ("id_liga") REFERENCES "ligas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes" ADD CONSTRAINT "FK_b5b45eae06b288f11e5b3fcc38e" FOREIGN KEY ("id_ginasio") REFERENCES "ginasios"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" ADD CONSTRAINT "FK_449fe4c78fb88327cd9e94c544e" FOREIGN KEY ("id_atleta_escalado") REFERENCES "atletas_escalados"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "votos_da_galera" ADD CONSTRAINT "FK_43c84e78723e7f2a80af90cd9fb" FOREIGN KEY ("id_atleta") REFERENCES "atletas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "votos_da_galera" DROP CONSTRAINT "FK_43c84e78723e7f2a80af90cd9fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" DROP CONSTRAINT "FK_449fe4c78fb88327cd9e94c544e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes" DROP CONSTRAINT "FK_b5b45eae06b288f11e5b3fcc38e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes" DROP CONSTRAINT "FK_c889de707e36b235a08c65e41ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auxiliares" DROP CONSTRAINT "FK_185c120f3624970475d8f1df84b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auxiliares" DROP CONSTRAINT "FK_63186f3f51e662a98fb04c176b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tecnicos" DROP CONSTRAINT "FK_606c789ebbaf0670a39edf937c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros" DROP CONSTRAINT "FK_7175f8ecb699effccd191c530d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros_partida" DROP CONSTRAINT "FK_f2e52bb8b002c915b80af6bad60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros_partida" DROP CONSTRAINT "FK_756f1be552d523d58d73102dae1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_4a4d635b2764920256ef9e33c4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_e343fae9dfdbb61550a5b7e26e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" DROP CONSTRAINT "FK_55307682a97abeecbe78ef95e2b"`,
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
      `ALTER TABLE "equipes_partidas" DROP CONSTRAINT "FK_b38dc0d6c02b7dc8d01243694fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" DROP CONSTRAINT "FK_b619e7a5725eaaf9ec76efbc0ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas_escalados" DROP CONSTRAINT "FK_f72a0deda9a05fa5079ebaf7d3e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas_escalados" DROP CONSTRAINT "FK_aff09371e8b4aedd2d46ef1121e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas" DROP CONSTRAINT "FK_442b67bb04c95a2e04ebbbd83be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas" DROP CONSTRAINT "FK_8673430de4ae5ab7edf8dba98c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "delegados" DROP CONSTRAINT "FK_a2b5b0b570956c36475eeb066c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "votos_da_galera" ADD CONSTRAINT "FK_43c84e78723e7f2a80af90cd9fb" FOREIGN KEY ("id_atleta") REFERENCES "atletas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fundamentos_atletas" ADD CONSTRAINT "FK_449fe4c78fb88327cd9e94c544e" FOREIGN KEY ("id_atleta_escalado") REFERENCES "atletas_escalados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes" ADD CONSTRAINT "FK_c889de707e36b235a08c65e41ca" FOREIGN KEY ("id_liga") REFERENCES "ligas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes" ADD CONSTRAINT "FK_b5b45eae06b288f11e5b3fcc38e" FOREIGN KEY ("id_ginasio") REFERENCES "ginasios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auxiliares" ADD CONSTRAINT "FK_63186f3f51e662a98fb04c176b7" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auxiliares" ADD CONSTRAINT "FK_185c120f3624970475d8f1df84b" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tecnicos" ADD CONSTRAINT "FK_606c789ebbaf0670a39edf937c3" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros" ADD CONSTRAINT "FK_7175f8ecb699effccd191c530d3" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros_partida" ADD CONSTRAINT "FK_756f1be552d523d58d73102dae1" FOREIGN KEY ("id_arbitro") REFERENCES "arbitros"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros_partida" ADD CONSTRAINT "FK_f2e52bb8b002c915b80af6bad60" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_de94a09c62e98501363519b05cf" FOREIGN KEY ("id_delegado") REFERENCES "delegados"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_e0872826715a9d03d6e1bcdbb14" FOREIGN KEY ("id_ginasio") REFERENCES "ginasios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_2dcc30b378f8e69aedb263a0465" FOREIGN KEY ("id_ganhadora") REFERENCES "equipes_partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_55307682a97abeecbe78ef95e2b" FOREIGN KEY ("id_visitante") REFERENCES "equipes_partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "partidas" ADD CONSTRAINT "FK_e343fae9dfdbb61550a5b7e26e7" FOREIGN KEY ("id_mandante") REFERENCES "equipes_partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ADD CONSTRAINT "FK_b619e7a5725eaaf9ec76efbc0ff" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipes_partidas" ADD CONSTRAINT "FK_b38dc0d6c02b7dc8d01243694fe" FOREIGN KEY ("id_partida") REFERENCES "partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas_escalados" ADD CONSTRAINT "FK_aff09371e8b4aedd2d46ef1121e" FOREIGN KEY ("id_equipe_partida") REFERENCES "equipes_partidas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas_escalados" ADD CONSTRAINT "FK_f72a0deda9a05fa5079ebaf7d3e" FOREIGN KEY ("id_atleta") REFERENCES "atletas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas" ADD CONSTRAINT "FK_8673430de4ae5ab7edf8dba98c1" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "atletas" ADD CONSTRAINT "FK_442b67bb04c95a2e04ebbbd83be" FOREIGN KEY ("id_equipe") REFERENCES "equipes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "delegados" ADD CONSTRAINT "FK_a2b5b0b570956c36475eeb066c3" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
