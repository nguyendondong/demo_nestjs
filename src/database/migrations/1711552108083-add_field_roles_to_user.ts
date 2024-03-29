import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldRolesToUser1711552108083 implements MigrationInterface {
  name = "AddFieldRolesToUser1711552108083";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "User" ADD "role" character varying NOT NULL DEFAULT 'invalid_user'`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e825d71115803906c14fe79e96" ON "User" ("role") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e825d71115803906c14fe79e96"`
    );
    await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "role"`);
  }
}
