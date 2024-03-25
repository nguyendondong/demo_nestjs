import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { dataOptions } from "./database/data-source";
import { AuthModule } from "./auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "@/users/users.service";
import { BcryptService } from "@/base/bcrypt.service";
import { BlobModule } from "@/blob/blob.module";
import { BlobService } from "@/blob/blob.service";
import { ScheduleModule } from "@nestjs/schedule";
import { CsvService } from "@/csv/csv.service";
import { MailModule } from "./mail/mail.module";
import { BullModule } from "@nestjs/bull";
import { CsvModule } from "@/csv/csv.module";
import { QueuesName } from "@/worker/queues";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env"],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataOptions),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get("REDIS_HOST"),
          port: configService.get("REDIS_PORT"),
        },
      }),
    }),
    UsersModule,
    CsvModule,
    AuthModule,
    MailModule,
  ],
  providers: [JwtService, BcryptService],
})
export class AppModule {}
