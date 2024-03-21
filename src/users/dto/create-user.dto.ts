import Helpers from "../../utils/TransformDataUtils";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  confirm_password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

@Exclude()
export class BlobDto {
  @Expose()
  id: string;

  @Expose()
  url: string;
}

@Exclude()
export class AttachmentDto {
  @Expose()
  fieldName: string;

  @Expose()
  @Type(() => BlobDto)
  blob: BlobDto;
}

@Exclude()
export class ResponseUserDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  @Type(() => AttachmentDto)
  attachments: AttachmentDto;
}
