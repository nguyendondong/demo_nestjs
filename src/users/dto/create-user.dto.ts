import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Exclude } from "class-transformer";

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  confirm_password: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class responseUserDto extends CreateUserDto {
  @Exclude()
  refreshToken: string;

  @Exclude()
  password: string;

  @Exclude()
  confirm_password: string;

  photos: any;
}
