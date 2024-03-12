import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, responseUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthGuard } from "@/auth/auth.guard";
import { transformDataEnitity } from "@/utils/TransformDataUtils";
import { PaginationDto } from "@/base/dto/pagination.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      await this.usersService.create(createUserDto);
    } catch (error) {
      console.log(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    console.log(paginationDto);
    return this.usersService.findAll(paginationDto);
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Get("/details/:id")
  async findOne(@Param("id") id: string) {
    return transformDataEnitity(
      responseUserDto,
      await this.usersService.findById(Number(id))
    );
  }

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
