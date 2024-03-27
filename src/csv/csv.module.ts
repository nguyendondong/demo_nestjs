import { Module } from "@nestjs/common";
import { CsvService } from "@/csv/csv.service";
import { BullModule } from "@nestjs/bull";
import { QueuesName } from "@/worker/queues";
import { BaseService } from "@/base/base.service";
import { BlobService } from "@/blob/blob.service";
import { BcryptService } from "@/base/bcrypt.service";
import { csvProcessor } from "@/worker/processor/csv.processor";

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueuesName.createUserByCsv,
    }),
  ],
  controllers: [],
  providers: [
    CsvService,
    BaseService,
    BlobService,
    BcryptService,
    csvProcessor,
  ],

  exports: [CsvService],
})
export class CsvModule {}
