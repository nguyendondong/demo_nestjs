import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { dataOptions } from "./database/data-source";
import { AuthModule } from "./auth/auth.module";
import { BaseService } from "./base/base.service";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "@/users/users.service";
import { BcryptService } from "@/base/bcrypt.service";
import { PhotoModule } from './photo/photo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env"],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataOptions),
    UsersModule,
    AuthModule,
    PhotoModule,
  ],
  controllers: [],
  providers: [BaseService, BcryptService, JwtService, UsersService],
})
export class AppModule {}
