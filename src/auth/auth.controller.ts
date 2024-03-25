import { Body, Controller, Post } from "@nestjs/common";
import { LoginUserDto, responseLoginUserDto } from "@/auth/dto/login-user-dto";
import { AuthService } from "@/auth/auth.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { unauthorizedResponse } from "@/swaggers/apiResponse.schemas";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  @ApiResponse({ status: 200, description: "OK", type: responseLoginUserDto })
  @ApiResponse(unauthorizedResponse)
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Post("/refresh-token")
  async refreshToken(@Body("refreshToken") refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }
}
