import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "@/database/entities/user.entity";
import { EntityManager } from "typeorm";
import { CreateUserDto, responseUserDto } from "@/users/dto/create-user.dto";
import { ValidationException } from "@/exception/base.exception";
import { BcryptService } from "@/base/bcrypt.service";
import { transformDataEnitity } from "@/utils/TransformDataUtils";
import { BaseService } from "@/base/base.service";
import { SearchDto } from "@/users/dto/search.dto";
import { responsePagination } from "@/base/dto/pagination.dto";
import { BlobService } from "@/blob/blob.service";

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    protected readonly entityManager: EntityManager,
    private readonly blobService: BlobService,
    private readonly bcryptService: BcryptService
  ) {
    super(entityManager);
  }

  async create(createUserDto: CreateUserDto): Promise<responseUserDto> {
    try {
      const hashPassword = await this.bcryptService.hash(
        createUserDto.password
      );
      const userData = this.entityManager.create(User, {
        ...createUserDto,
        password: hashPassword,
      });

      const user = await this.entityManager.save(User, userData);

      return transformDataEnitity(responseUserDto, user);
    } catch (error) {
      throw new ValidationException(error.detail, error.code);
    }
  }

  async findAll(searchDto: SearchDto): Promise<responsePagination> {
    const users = await this.FindWithPagination(User, searchDto);

    return transformDataEnitity(responsePagination, users);
  }

  async findByEmail(email: string) {
    const user = await this.entityManager.findOneBy(User, { email });
    if (!user) {
      throw new UnauthorizedException("Email is wrong");
    }

    return user;
  }

  xx;

  async findById(id: number): Promise<User> {
    const user = await this.entityManager.findOne(User, {
      where: {
        id,
      },
      relations: ["blob"],
      select: ["id", "blob"],
    });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    console.log(user);
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto | any,
    file?: Express.Multer.File
  ) {
    if (file && (await this.blobService.uploadFile(file))) {
      await this.blobService.create(file, {
        relationId: id,
        relationType: "user",
      });
    }
    await this.entityManager.update(User, id, { ...updateUserDto });

    return true;
  }

  async remove(id: number) {
    return await this.entityManager.delete(User, id);
  }
}
