import { PaginationDto } from "@/base/dto/pagination.dto";
import { IsOptional, IsString } from "class-validator";

export class SearchDto extends PaginationDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  email: string;
}
