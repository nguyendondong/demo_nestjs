import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "@/auth/auth.guard";
import { transformDataEnitity } from "@/utils/TransformDataUtils";
import { SearchDto } from "@/users/dto/search.dto";
import { CreateUserDto, responseUserDto } from "@/users/dto/create-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiBearerAuth()
@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/register")
  register(@Body() createUserDto: CreateUserDto): Promise<responseUserDto> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() searchDto: SearchDto) {
    console.log(searchDto);
    return this.usersService.findAll(searchDto);
  }

  @Patch(":id")
  @UseInterceptors(
    FileInterceptor("avatar", {
      dest: "uploads",
      fileFilter: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        const allowedMimes = ["jpeg", "pjpeg", "png"];
        if (!allowedMimes.includes(ext)) {
          req.fileValidationError = "Only image files are allowed!";
          cb(new BadRequestException("Only image files are allowed!"), false);
        }
        cb(null, true);
      },
    })
  )
  async update(
    @Param("id") id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log(updateUserDto);
    return this.usersService.update(id, updateUserDto, file);
  }

  @UseGuards(AuthGuard)
  @Get("/details/:id")
  async findOne(@Param("id") id: string) {
    return transformDataEnitity(
      responseUserDto,
      await this.usersService.findById(Number(id))
    );
  }

  x;

  @UseGuards(AuthGuard)
  @Get("/profile")
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    // return this.usersService.remove(+id);
  }
}
