import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "@/api/v1/users/users.module";
import { dataOptions } from "./database/data-source";
import { AuthModule } from "@/api/v1/auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { BcryptService } from "@/api/base/bcrypt.service";
import { ScheduleModule } from "@nestjs/schedule";
import { MailModule } from "./mail/mail.module";
import { BullModule } from "@nestjs/bull";
import { CsvModule } from "@/api/v1/csv/csv.module";
import { WorkerModule } from "@/api/v1/worker/worker.module";
import { I18nModule } from "nestjs-i18n";
import {
  AcceptLanguageResolver,
  HeaderResolver,
  QueryResolver,
} from "nestjs-i18n";
import { join } from "path";
import { AppController } from "@/app.controller";

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
          name: "NestJS-Demo-Redis",
          host: configService.get("REDIS_HOST"),
          port: configService.get("REDIS_PORT"),
        },
        defaultJobOptions: {
          attempts: 3,
          // removeOnComplete: true
        },
      }),
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow("FALLBACK_LANGUAGE"),
        typesOutputPath: join(__dirname, "../src/i18n/i18n.generated.ts"),
        loaderOptions: {
          path: join(__dirname, "./i18n/"),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ["lang"] },
        AcceptLanguageResolver,
        new HeaderResolver(["x-lang"]),
      ],
      inject: [ConfigService],
    }),
    UsersModule,
    CsvModule,
    AuthModule,
    MailModule,
    WorkerModule,
  ],
  providers: [JwtService, BcryptService],
  controllers: [AppController],
})
export class AppModule {}
