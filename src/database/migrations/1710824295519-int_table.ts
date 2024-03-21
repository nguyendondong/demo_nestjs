import { MigrationInterface, QueryRunner } from "typeorm";

export class IntTable1710824295519 implements MigrationInterface {
  name = "IntTable1710824295519";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "User" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "refreshToken" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Blob" ("id" SERIAL NOT NULL, "fileName" character varying NOT NULL, "relationId" integer NOT NULL, "fieldName" character varying, "relationType" character varying NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_55d3c72dfbf24703d11e46bc3ed" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "Blob" ADD CONSTRAINT "FK_d17a6a292661219b7d24b5be0ac" FOREIGN KEY ("relationId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Blob" DROP CONSTRAINT "FK_d17a6a292661219b7d24b5be0ac"`
    );
    await queryRunner.query(`DROP TABLE "Blob"`);
    await queryRunner.query(`DROP TABLE "User"`);
  }
}
