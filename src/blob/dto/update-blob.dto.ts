import { PartialType } from "@nestjs/mapped-types";
import { CreateBlobDto } from "./create-blob.dto";

export class UpdateBlobDto extends PartialType(CreateBlobDto) {}
