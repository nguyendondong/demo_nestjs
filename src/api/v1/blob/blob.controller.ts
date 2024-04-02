import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from "@nestjs/common";
import { BlobService } from "./blob.service";
import { UpdateBlobDto } from "./dto/update-blob.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "@/api/v1/auth/auth.guard";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Blob")
@Controller("blobs")
export class BlobController {
  constructor(private readonly blobService: BlobService) {}

  @UseGuards(AuthGuard)
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("images", {
      dest: "uploads",
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        const allowedMimes = ["jpeg", "pjpeg", "png", "jpg"];
        if (!allowedMimes.includes(ext)) {
          req.fileValidationError = "Only image files are allowed!";
          cb(new BadRequestException("Only image files are allowed!"), false);
        }
        cb(null, true);
      },
    })
  )
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException("File not found");
    }
    return await this.blobService.uploadFile(file);
  }

  @Get()
  async findAll() {
    return await this.blobService.WithoutAttachment();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.blobService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBlobDto: UpdateBlobDto) {
    return this.blobService.update(+id, updateBlobDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.blobService.remove(+id);
  }
}
