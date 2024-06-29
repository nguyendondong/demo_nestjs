import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "@/api/v1/users/users.service";
import {
  LoginUserDto,
  responseLoginUserDto,
} from "@/api/v1/auth/dto/login-user-dto";
import { JwtService } from "@nestjs/jwt";
import { BcryptService } from "@/api/base/bcrypt.service";
import { jwtConstants } from "@/api/v1/auth/constants";
import Helpers from "@/utils/TransformDataUtils";
import { ResponseUserDto } from "@/api/v1/users/dto/create-user.dto";
import { User } from "@/database/entities/user.entity";
import { RolesName } from "src/api/base";
import { MailService } from "@/mail/mail.service";
import Utils from "@/utils/Utils";

@Injectable()
export class AuthService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private jwtService: JwtService
  ) {}

  async login(lang: string, loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findByEmail(email);
    if (user.role === RolesName.INVALID_USER) {
      throw new ForbiddenException(Utils.t("auth.invalidTokenOrUserInactive"));
    }
    const checkPass = await this.bcryptService.compare(password, user.password);
    if (!checkPass) {
      throw new UnauthorizedException({ password: "Password is wrong" });
    }

    return this.generateToken(user);
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const verify = await this.jwtService.verifyAsync(refreshToken, {
      secret: jwtConstants.refreshTokenSecret,
    });

    const user = await this.usersService.findByEmail(verify.email);

    if (!user) throw new BadRequestException("Refresh token is wrong");

    return this.generateToken(user);
  }

  async confirmEmail(token: string): Promise<any> {
    const user = await this.usersService.findByToken(token);
    await this.usersService.update(user.id, {
      role: RolesName.USER,
    });
    return Helpers.transformDataEnitity(ResponseUserDto, user);
  }

  private async generateToken(user: User): Promise<responseLoginUserDto> {
    const payload = {
      email: user.email,
      user_id: user.id,
      role: user.role,
    };
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

  async resetPasswordByEmail(lang: string, email: string) {
    const user = await this.usersService.findByEmail(email);
    const token = await this.usersService.generateRandomToken(
      email,
      user.confirmationToken
    );
    await this.mailService.sendResetPassword(lang, user, token);
  }

  async confirmResetPasswordToken(token: string) {
    const user = await this.usersService.findByToken(token);
    return Helpers.transformDataEnitity(ResponseUserDto, user);
  }
}
