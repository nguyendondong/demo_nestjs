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
import { WorkerModule } from "./worker/worker.module";
import { I18nModule } from "nestjs-i18n";
import {
  AcceptLanguageResolver,
  HeaderResolver,
  QueryResolver,
} from "nestjs-i18n";
import { join } from "path";

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
})
export class AppModule {}
