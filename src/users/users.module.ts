import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/database/entities/user.entity";
import { BcryptService } from "@/base/bcrypt.service";
import { BaseService } from "@/base/base.service";
import { BlobService } from "@/blob/blob.service";
import { CsvService } from "@/base/csv.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    BcryptService,
    BlobService,
    CsvService,
    BaseService,
  ],
})
export class UsersModule {}
