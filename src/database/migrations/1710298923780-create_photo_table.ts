import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePhotoTable1710298923780 implements MigrationInterface {
  name = "CreatePhotoTable1710298923780";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "photos" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_5220c45b8e32d49d767b9b3d725" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "photos" ADD CONSTRAINT "FK_74da4f305b050f7d27c73b04263" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "photos" DROP CONSTRAINT "FK_74da4f305b050f7d27c73b04263"`
    );
    await queryRunner.query(`DROP TABLE "photos"`);
  }
}
