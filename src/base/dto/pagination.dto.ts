import { IsNumber, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit: number;
}
