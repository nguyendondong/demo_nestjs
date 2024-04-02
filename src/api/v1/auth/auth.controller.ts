import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import {
  LoginUserDto,
  responseLoginUserDto,
} from "@/api/v1/auth/dto/login-user-dto";
import { AuthService } from "@/api/v1/auth/auth.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { unauthorizedResponse } from "@/swaggers/apiResponse.schemas";
import { I18nContext } from "nestjs-i18n";

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

  @Get("/confirm-email")
  async confirm(@Query("token") token: string) {
    return await this.authService.confirmEmail(token);
  }

  @Get("/reset-password")
  async resetPassword(@Query("token") token: string) {
    return await this.authService.confirmResetPasswordToken(token);
  }

  @Post("/send-email-reset-password")
  async resetPasswordByEmail(@Body("email") email: string) {
    const lang = I18nContext.current().lang;
    return await this.authService.resetPasswordByEmail(lang, email);
  }
}
