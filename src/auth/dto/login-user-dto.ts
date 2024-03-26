import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ResponseUserDto } from "@/users/dto/create-user.dto";
import { i18nValidationMessage } from "nestjs-i18n";

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsEmail({}, { message: i18nValidationMessage("validation.INVALID_EMAIL") })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage("validation.NOT_EMPTY") })
  @IsString({ message: i18nValidationMessage("validation.IS_STRING") })
  password: string;
}

export class responseLoginUserDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  dataUser: ResponseUserDto;
}
