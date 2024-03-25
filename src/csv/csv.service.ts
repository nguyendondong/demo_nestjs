import { Injectable, Logger } from "@nestjs/common";
import * as fs from "fs";
import { parse } from "csv-parse";
import { CsvFileData } from "@/utils/validator/csv-validation.dto";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { QueuesName } from "@/worker/queues";
import { BlobService } from "@/blob/blob.service";
import { User } from "@/database/entities/user.entity";
import { BaseService } from "@/base/base.service";
import { BcryptService } from "@/base/bcrypt.service";
import { EntityManager } from "typeorm";

@Injectable()
export class CsvService extends BaseService {
  constructor(
    @InjectQueue(QueuesName.createUserByCsv) private csvQueue: Queue,
    private readonly blobService: BlobService,
    private readonly bcryptService: BcryptService,
    protected readonly entityManager: EntityManager
  ) {
    super(entityManager);
  }

  async processFile(fileName: string): Promise<any> {
    console.log("Allow to solve file CSV");
    const csvData: any[] = [];
    const readStream = fs.createReadStream(`uploads/csv/${fileName}`);

    return new Promise((resolve, reject) => {
      readStream
        .pipe(
          parse({
            delimiter: ";",
            trim: true,
            quote: true,
            relax_quotes: true,
            skip_empty_lines: true,
            relax_column_count: true,
          })
        )
        .on("data", (row: any) => {
          csvData.push(row);
        })
        .on("end", async () => {
          const fileData: CsvFileData = {
            header_row: csvData[0],
            data: csvData.slice(1, csvData.length),
          };
          resolve(fileData);
        })
        .on("error", (error: any) => {
          reject(error);
        });
    });
  }

  async transformPasswordAndCreate(data: any[], header: string[]) {
    const res = await Promise.all(
      data.map(async (row) => {
        return {
          [header[0]]: row[0],
          [header[1]]: row[1],
          [header[2]]: await this.bcryptService.hash(row[2]),
        };
      })
    );

    return await this.updateMultiple(User, res, ["email"]);
  }

  async createUserByCsv(file: Express.Multer.File) {
    const dataCsv = await this.processFile(file.filename);
    const { header_row, data } = dataCsv;

    await Promise.all([
      this.transformPasswordAndCreate(data, header_row),
      this.blobService.create(file),
    ]);

    return true;
  }

  async CronJobcreaUserByCsv(name: string, file: Express.Multer.File) {
    Logger.log("Processing uploaded file...");

    return await this.csvQueue.add({ file });
  }
}
