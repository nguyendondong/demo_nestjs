import { IsEmail, IsString, Length } from "class-validator";
import { Exclude } from "class-transformer";
import { Optional } from "@nestjs/common";

export class UpdateUserDto {
  @IsEmail()
  @Optional()
  email: string;

  @IsString()
  @Optional()
  @Length(8, 20)
  password: string;

  @IsString()
  @Optional()
  name: string;

  @IsString()
  @Optional()
  refreshToken: string;
}

export class responseUpdateUserDto extends UpdateUserDto {
  @Exclude()
  password: string;

  @Exclude()
  confirm_password: string;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;
}
