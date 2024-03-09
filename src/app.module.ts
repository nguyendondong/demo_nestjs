import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { dataOptions } from "./database/data-source";
import { AuthModule } from "./auth/auth.module";
import { BaseService } from "./base/base.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env"],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataOptions),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [BaseService, JwtService],
})
export class AppModule {}
