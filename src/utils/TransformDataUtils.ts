import { plainToClass, plainToInstance } from "class-transformer";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/api/base/S3Client";
import { Attachment } from "@/database/entities/attachment.entity";

const Helpers = {
  transformDataEnitity: <T>(
    dtoClass: new () => T,
    data: Record<string, any>
  ): T => {
    if (data.attachments) {
      data = Helpers.tranformBlobUrl(data);
    }
    return plainToInstance(dtoClass, data);
  },
  /**
   * A function that transforms the data response into an instance of the specified class.
   *
   * @param {new () => T} dtoClass - the class constructor for the data transfer object
   * @param {Record<string, any>} data - the data to be transformed
   * @return {T} the instance of the specified class
   */
  transformDataResponse: <T>(
    dtoClass: new () => T,
    data: Record<string, any>
  ): T => {
    return plainToClass(dtoClass, data, {
      excludeExtraneousValues: true,
    });
  },

  async getSignFileUrl(fileName: string, expiresIn?: number) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
    });
    expiresIn = expiresIn || 3600;

    return await getSignedUrl(s3Client, command, { expiresIn });
  },

  async tranformAttachment(attachment: Attachment) {
    const signedUrl = await Helpers.getSignFileUrl(attachment.blob?.url);

    return {
      ...attachment,
      blob: {
        ...attachment.blob,
        url: signedUrl,
      },
    };
  },

  async tranformBlobUrl(entity: any) {
    return Object.assign(entity, {
      ...entity,
      attachments: await Promise.all(
        entity.attachments.map((attachment) => {
          return Helpers.tranformAttachment(attachment);
        })
      ),
    });
  },
};

export default Helpers;
