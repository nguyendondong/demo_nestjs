import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/database/entities/user.entity";
import { BcryptService } from "@/api/base/bcrypt.service";
import { BaseService } from "@/api/base/base.service";
import { CsvModule } from "@/api/v1/csv/csv.module";
import { BlobModule } from "@/api/v1/blob/blob.module";
import { MailModule } from "@/mail/mail.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CsvModule,
    BlobModule,
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, BcryptService, BaseService],
})
export class UsersModule {}
