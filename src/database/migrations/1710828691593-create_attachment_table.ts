import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAttachmentTable1710828691593 implements MigrationInterface {
  name = "CreateAttachmentTable1710828691593";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Blob" DROP CONSTRAINT "FK_d17a6a292661219b7d24b5be0ac"`
    );
    await queryRunner.query(
      `CREATE TABLE "Attachment" ("id" SERIAL NOT NULL, "fieldName" character varying NOT NULL, "relationId" integer NOT NULL, "relationType" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "blobId" integer, CONSTRAINT "REL_096a3e170f1b873df302cb8060" UNIQUE ("blobId"), CONSTRAINT "PK_b5708fe507c278546d69ee56566" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "Blob" DROP COLUMN "relationId"`);
    await queryRunner.query(`ALTER TABLE "Blob" DROP COLUMN "fieldName"`);
    await queryRunner.query(`ALTER TABLE "Blob" DROP COLUMN "relationType"`);
    await queryRunner.query(`ALTER TABLE "Blob" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "Blob" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "Blob" ADD "fileType" character varying NOT NULL`
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
    await queryRunner.query(`ALTER TABLE "Blob" DROP COLUMN "fileType"`);
    await queryRunner.query(
      `ALTER TABLE "Blob" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "Blob" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    );
    await queryRunner.query(
      `ALTER TABLE "Blob" ADD "relationType" character varying NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "Blob" ADD "fieldName" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "Blob" ADD "relationId" integer NOT NULL`
    );
    await queryRunner.query(`DROP TABLE "Attachment"`);
    await queryRunner.query(
      `ALTER TABLE "Blob" ADD CONSTRAINT "FK_d17a6a292661219b7d24b5be0ac" FOREIGN KEY ("relationId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
