import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFirstName1720412426799 implements MigrationInterface {
  name = "AddFirstName1720412426799";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "User" ADD "firstName" character varying NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "firstName"`);
  }
}
