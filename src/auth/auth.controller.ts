import { Body, Controller, Param, Post } from "@nestjs/common";
import { CreateUserDto, responseUserDto } from "@/users/dto/create-user.dto";
import { UsersService } from "@/users/users.service";
import { LoginUserDto } from "@/auth/dto/login-user-dto";
import { AuthService } from "@/auth/auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Post("/register")
  register(@Body() createUserDto: CreateUserDto): Promise<responseUserDto> {
    return this.usersService.create(createUserDto);
  }

  @Post("/login")
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post("/refresh-token")
  async refreshToken(@Body("refreshToken") refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }
}
