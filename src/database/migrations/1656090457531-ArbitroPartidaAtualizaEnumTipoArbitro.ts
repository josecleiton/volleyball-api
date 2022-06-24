import { MigrationInterface, QueryRunner } from 'typeorm';

export class ArbitroPartidaAtualizaEnumTipoArbitro1656090457531
  implements MigrationInterface
{
  name = 'ArbitroPartidaAtualizaEnumTipoArbitro1656090457531';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."arbitros_partida_tipo_enum" RENAME TO "arbitros_partida_tipo_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."arbitros_partida_tipo_enum" AS ENUM('principal', 'secundário', 'juiz_quadra')`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros_partida" ALTER COLUMN "tipo" TYPE "public"."arbitros_partida_tipo_enum" USING "tipo"::"text"::"public"."arbitros_partida_tipo_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."arbitros_partida_tipo_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."arbitros_partida_tipo_enum_old" AS ENUM('principal')`,
    );
    await queryRunner.query(
      `ALTER TABLE "arbitros_partida" ALTER COLUMN "tipo" TYPE "public"."arbitros_partida_tipo_enum_old" USING "tipo"::"text"::"public"."arbitros_partida_tipo_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."arbitros_partida_tipo_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."arbitros_partida_tipo_enum_old" RENAME TO "arbitros_partida_tipo_enum"`,
    );
  }
}
