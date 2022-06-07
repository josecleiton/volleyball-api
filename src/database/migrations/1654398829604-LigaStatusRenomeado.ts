import {MigrationInterface, QueryRunner} from "typeorm";

export class LigaStatusRenomeado1654398829604 implements MigrationInterface {
    name = 'LigaStatusRenomeado1654398829604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."ligas_status_enum" RENAME TO "ligas_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."ligas_status_enum" AS ENUM('criada', 'classificatória', 'quartas', 'semis', 'final', 'premiacao', 'concluida')`);
        await queryRunner.query(`ALTER TABLE "ligas" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ligas" ALTER COLUMN "status" TYPE "public"."ligas_status_enum" USING "status"::"text"::"public"."ligas_status_enum"`);
        await queryRunner.query(`ALTER TABLE "ligas" ALTER COLUMN "status" SET DEFAULT 'criada'`);
        await queryRunner.query(`DROP TYPE "public"."ligas_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ligas_status_enum_old" AS ENUM('criada', 'classificatória', 'quartas', 'semis', 'finais', 'premiacao', 'concluida')`);
        await queryRunner.query(`ALTER TABLE "ligas" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ligas" ALTER COLUMN "status" TYPE "public"."ligas_status_enum_old" USING "status"::"text"::"public"."ligas_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "ligas" ALTER COLUMN "status" SET DEFAULT 'criada'`);
        await queryRunner.query(`DROP TYPE "public"."ligas_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."ligas_status_enum_old" RENAME TO "ligas_status_enum"`);
    }

}
