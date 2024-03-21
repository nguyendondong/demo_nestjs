import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "@/users/users.service";
import { LoginUserDto, responseLoginUserDto } from "@/auth/dto/login-user-dto";
import { JwtService } from "@nestjs/jwt";
import { BcryptService } from "@/base/bcrypt.service";
import { jwtConstants } from "@/auth/constants";
import Helpers from "@/utils/TransformDataUtils";
import { ResponseUserDto } from "@/users/dto/create-user.dto";
import { User } from "@/database/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findByEmail(email);
    const checkPass = await this.bcryptService.compare(password, user.password);
    if (!checkPass) {
      throw new UnauthorizedException("Password is wrong");
    }
    return this.genateToken(user);
  }

  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.refreshTokenSecret,
      });

      const user = await this.usersService.findByEmail(verify.email);

      if (user) {
        return this.genateToken(user);
      } else {
        throw new UnauthorizedException("Refresh token is wrong");
      }
    } catch (error) {
      throw new BadRequestException("Refresh token is wrong");
    }
  }

  private async genateToken(user: User): Promise<responseLoginUserDto> {
    const payload = { email: user.email, user_id: user.id };
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.refreshTokenSecret,
      expiresIn: jwtConstants.expiresIn,
    });

    await this.usersService.update(user.id, {
      refreshToken: refresh_token,
    });
    const dataUser = Helpers.transformDataEnitity(ResponseUserDto, user);
    return {
      access_token,
      refresh_token,
      dataUser,
    };
  }
}
