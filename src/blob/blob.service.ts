import "dotenv/config";
import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateBlobDto } from "./dto/update-blob.dto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { EntityManager } from "typeorm";
import { Blob } from "@/database/entities/blob.entity";

@Injectable()
export class BlobService {
  constructor(protected readonly entityManager: EntityManager) {}

  s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  async uploadFile(file: Express.Multer.File): Promise<boolean> {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: `${file.destination}/${file.fieldname}/${file.originalname}`,
          Body: file.buffer,
        })
      );
      return true;
    } catch (error) {
      throw new BadRequestException("Upload file to S3 failed");
    }
  }

  async create(file: Express.Multer.File, options: any) {
    try {
      const { relationType, relationId } = options;
      const blob = this.entityManager.create(Blob, {
        fileName: file.originalname,
        relationType: relationType,
        relationId: relationId,
        fieldName: file.fieldname,
        url: `${file.destination}/${file.fieldname}/${file.originalname}`,
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
    return `This action updates a #${id} Blob`;
  }

  remove(id: number) {
    return `This action removes a #${id} Blob`;
  }
}
