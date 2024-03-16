import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { dataOptions } from "./database/data-source";
import { AuthModule } from "./auth/auth.module";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "@/users/users.service";
import { BcryptService } from "@/base/bcrypt.service";
import { BlobModule } from "@/blob/blob.module";
import { BlobService } from "@/blob/blob.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env"],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataOptions),
    UsersModule,
    AuthModule,
    BlobModule,
  ],
  controllers: [],
  providers: [JwtService, UsersService, BlobService, BcryptService],
})
export class AppModule {}
