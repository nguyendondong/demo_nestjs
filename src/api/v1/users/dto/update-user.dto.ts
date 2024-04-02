import { Exclude } from "class-transformer";
import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty()
  @Optional()
  email: string;

  @ApiProperty()
  @Optional()
  name: string;
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
