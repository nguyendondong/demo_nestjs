import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitTable1711438474837 implements MigrationInterface {
  name = "CreateInitTable1711438474837";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Blob" ("id" SERIAL NOT NULL, "fileType" character varying NOT NULL, "fileName" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_55d3c72dfbf24703d11e46bc3ed" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "User" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "refreshToken" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Attachment" ("id" SERIAL NOT NULL, "fieldName" character varying NOT NULL, "relationId" integer NOT NULL, "relationType" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "blobId" integer, CONSTRAINT "REL_096a3e170f1b873df302cb8060" UNIQUE ("blobId"), CONSTRAINT "PK_b5708fe507c278546d69ee56566" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "Attachment" ADD CONSTRAINT "FK_f262385478c46c3730bb59c13e3" FOREIGN KEY ("relationId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Attachment" ADD CONSTRAINT "FK_096a3e170f1b873df302cb80605" FOREIGN KEY ("blobId") REFERENCES "Blob"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Attachment" DROP CONSTRAINT "FK_096a3e170f1b873df302cb80605"`
    );
    await queryRunner.query(
      `ALTER TABLE "Attachment" DROP CONSTRAINT "FK_f262385478c46c3730bb59c13e3"`
    );
    await queryRunner.query(`DROP TABLE "Attachment"`);
    await queryRunner.query(`DROP TABLE "User"`);
    await queryRunner.query(`DROP TABLE "Blob"`);
  }
}
