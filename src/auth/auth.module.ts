import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersService } from "@/users/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/database/entities/user.entity";
import { BcryptService } from "@/base/bcrypt.service";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "@/auth/constants";
import { BlobService } from "@/blob/blob.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptService, UsersService, BlobService],
})
export class AuthModule {}
