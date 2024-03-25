import { Module } from "@nestjs/common";
import { CsvService } from "@/csv/csv.service";
import { BullModule } from "@nestjs/bull";
import { QueuesName } from "@/worker/queues";
import { BaseService } from "@/base/base.service";
import { BlobService } from "@/blob/blob.service";
import { BcryptService } from "@/base/bcrypt.service";
import { createUserByCsvProcessor } from "@/worker/createUserByCsv.processor";

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: QueuesName.createUserByCsv,
      },
      {
        name: QueuesName.email,
      }
    ),
  ],
  controllers: [],
  providers: [
    CsvService,
    BaseService,
    BlobService,
    BcryptService,
    createUserByCsvProcessor,
  ],

  exports: [CsvService],
})
export class CsvModule {}
