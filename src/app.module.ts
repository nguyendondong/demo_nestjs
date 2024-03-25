import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { dataOptions } from "./database/data-source";
import { AuthModule } from "./auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { BcryptService } from "@/base/bcrypt.service";
import { ScheduleModule } from "@nestjs/schedule";
import { MailModule } from "./mail/mail.module";
import { BullModule } from "@nestjs/bull";
import { CsvModule } from "@/csv/csv.module";

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
