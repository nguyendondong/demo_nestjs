import { Module } from "@nestjs/common";
import { CsvService } from "@/api/v1/csv/csv.service";
import { BullModule } from "@nestjs/bull";
import { QueuesName } from "@/api/base";
import { BaseService } from "@/api/base/base.service";
import { BlobService } from "@/api/v1/blob/blob.service";
import { BcryptService } from "@/api/base/bcrypt.service";
import { csvProcessor } from "@/processor/csv.processor";

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
