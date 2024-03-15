import { IsEmail, IsString, Length } from "class-validator";
import { Exclude } from "class-transformer";
import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty()
  @IsEmail()
  @Optional()
  email: string;

  @ApiProperty()
  @IsString()
  @Optional()
  @Length(8, 20)
  password: string;

  @ApiProperty()
  @IsString()
  @Optional()
  name: string;

  @ApiProperty()
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
