import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ValidationMessage } from "../../../../utils/validator/Validation";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({
    message: ValidationMessage.NOT_EMPTY(),
  })
  @IsEmail({}, { message: ValidationMessage.INVALID_EMAIL() })
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: ValidationMessage.NOT_EMPTY(),
  })
  @IsString({ message: i18nValidationMessage("validation.IS_STRING") })
  @Length(8, 20)
  password: string;

  @ApiProperty()
  @IsNotEmpty({
    message: ValidationMessage.NOT_EMPTY(),
  })
  @IsString({ message: i18nValidationMessage("validation.IS_STRING") })
  @Length(8, 20)
  confirm_password: string;

  @ApiProperty()
  @IsNotEmpty({
    message: ValidationMessage.NOT_EMPTY(),
  })
  @IsString({ message: i18nValidationMessage("validation.IS_STRING") })
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
