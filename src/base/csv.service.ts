import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { DeepPartial, EntityManager, EntityTarget } from "typeorm";
import * as fs from "fs";
import { parse } from "csv-parse";
import { CsvFileData } from "@/utils/validator/csv-validation.dto";
import { User } from "@/database/entities/user.entity";
import { BcryptService } from "@/base/bcrypt.service";

@Injectable()
export class CsvService {
  constructor(
    @InjectEntityManager() protected readonly entityManager: EntityManager,
    private readonly bcryptService: BcryptService
  ) {}

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
}
