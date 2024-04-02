import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersService } from "@/api/v1/users/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/database/entities/user.entity";
import { BcryptService } from "@/api/base/bcrypt.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "@/api/v1/auth/constants";
import { MailModule } from "@/mail/mail.module";
import { BlobService } from "@/api/v1/blob/blob.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
      global: true,
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptService, UsersService, BlobService],
})
export class AuthModule {}
