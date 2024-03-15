import { ApiProperty } from "@nestjs/swagger";

export class CreateBlobDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;
}
