import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Query,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "@/auth/auth.guard";
import Helpers from "@/utils/TransformDataUtils";
import { SearchDto } from "@/users/dto/search.dto";
import { CreateUserDto, ResponseUserDto } from "@/users/dto/create-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { storage } from "@/config/storage.config";
import { ValidationException } from "@/exception/base.exception";

@ApiBearerAuth()
@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/register")
  register(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() searchDto: SearchDto) {
    return this.usersService.findAll(searchDto);
  }

  @UseGuards(AuthGuard)
  @Patch(":id")
  @UseInterceptors(FileInterceptor("avatar"))
  async update(
    @Param("id") id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|gif)$/,
          }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    return this.usersService.update(id, updateUserDto, file);
  }

  @UseGuards(AuthGuard)
  @Get("/details/:id")
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findById(Number(id));

    return Helpers.transformDataEnitity(ResponseUserDto, user);
  }

  @UseGuards(AuthGuard)
  @Get("/profile")
  getProfile(@Req() req: any) {
    return req.user;
  }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  // return this.usersService.remove(+id);
  // }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor("userCsv", { storage }))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: "text/csv",
          }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    try {
      return await this.usersService.creaUserByCsv(file);
    } catch (error) {
      throw new ValidationException(error.detail, error.code);
    }
  }
}
