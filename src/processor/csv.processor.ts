import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { QueuesName } from "@/api/base";
import { Job } from "bull";
import { CsvService } from "@/api/v1/csv/csv.service";

@Processor(QueuesName.createUserByCsv)
export class csvProcessor {
  private logger = new Logger();

  constructor(private readonly csvService: CsvService) {}

  @Process("createUserByCsv")
  async handleTask(job: Job) {
    const file = job.data.file;
    return await this.process(file);
  }

  async process(file: Express.Multer.File) {
    Logger.log("Processing CreateUserByCsv is running...");
    return await this.csvService.createUserByCsv(file);
  }
}
