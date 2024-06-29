import "dotenv/config";
import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateBlobDto } from "./dto/update-blob.dto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { EntityManager } from "typeorm";
import { Blob } from "@/database/entities/blob.entity";
import { s3Client } from "@/api/base/S3Client";
import { Attachment } from "@/database/entities/attachment.entity";

@Injectable()
export class BlobService {
  constructor(protected readonly entityManager: EntityManager) {}

  async uploadFile(file: Express.Multer.File): Promise<boolean> {
    try {
      if (process.env.USE_AWS_S3_BUCKET === "true") {
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: `uploads/${file.fieldname}/${file.originalname}`,
            Body: file.buffer,
          })
        );
      }

      return true;
    } catch (error) {
      throw new BadRequestException(`Upload file to S3 failed, ${error}`);
    }
  }

  async create(file: Express.Multer.File) {
    const url = file.path
      ? `uploads/csv/${file.filename}`
      : `uploads/${file.fieldname}/${file.originalname}`;
    try {
      const blob = this.entityManager.create(Blob, {
        fileName: file.originalname,
        fileType: file.mimetype,
        fieldName: file.fieldname,
        url: url,
      });

      return await this.entityManager.save(Blob, blob);
    } catch (error) {}
    throw new BadRequestException("Create blob failed");
  }

  findAll() {
    return `This action returns all Blob`;
  }

  findOne(id: number) {
    return `This action returns a #${id} Blob`;
  }

  update(id: number, updateBlobDto: UpdateBlobDto) {
    return `This action updates a #${id} Blob with name ${updateBlobDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} Blob`;
  }

  async WithoutAttachment() {
    return this.entityManager
      .createQueryBuilder(Blob, "blob")
      .leftJoin(Attachment, "attachment", "attachment.blob = blob.id")
      .where("attachment.blob is null")
      .getMany();
  }
}
