import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLastName1720412204559 implements MigrationInterface {
  name = "AddLastName1720412204559";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "User" ADD "lastName" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "lastName"`);
  }
}
