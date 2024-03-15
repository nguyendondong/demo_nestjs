import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBlobTable1710303311735 implements MigrationInterface {
    name = 'CreateBlobTable1710303311735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blobs" ("id" SERIAL NOT NULL, "fileName" character varying NOT NULL, "BlobType" character varying NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_fe61649fa345f685eb31b949e4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blobs" ADD CONSTRAINT "FK_1ebdbbb95685fd1e929be488466" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blobs" DROP CONSTRAINT "FK_1ebdbbb95685fd1e929be488466"`);
        await queryRunner.query(`DROP TABLE "blobs"`);
    }

}
