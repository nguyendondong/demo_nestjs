import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldConfirmationTokenToUser1711682677347
  implements MigrationInterface
{
  name = "AddFieldConfirmationTokenToUser1711682677347";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "User" ADD "confirmationToken" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "User" ALTER COLUMN "refreshToken" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "User" ALTER COLUMN "refreshToken" DROP DEFAULT`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "User" ALTER COLUMN "refreshToken" SET DEFAULT ''`
    );
    await queryRunner.query(
      `ALTER TABLE "User" ALTER COLUMN "refreshToken" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "User" DROP COLUMN "confirmationToken"`
    );
  }
}
