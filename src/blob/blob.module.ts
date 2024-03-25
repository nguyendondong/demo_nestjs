import { Module } from "@nestjs/common";
import { BlobService } from "./blob.service";
import { BlobController } from "./blob.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blob } from "@/database/entities/blob.entity";
import { ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    TypeOrmModule.forFeature([Blob]),

    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
  ],
  controllers: [BlobController],
  providers: [BlobService],
  exports: [BlobService],
})
export class BlobModule {}
