import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "@/database/entities/user.entity";
import { EntityManager } from "typeorm";
import { CreateUserDto, responseUserDto } from "@/users/dto/create-user.dto";
import { ValidationException } from "@/exception/base.exception";
import { BcryptService } from "@/base/bcrypt.service";
import { transformDataEnitity } from "@/utils/TransformDataUtils";
import { BaseService } from "@/base/base.service";
import { PaginationDto } from "@/base/dto/pagination.dto";

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    protected readonly entityManager: EntityManager,
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

  async findAll(paginationDto: PaginationDto): Promise<responseUserDto> {
    const users = await this.FindWithPagination(User, paginationDto);
    return transformDataEnitity(responseUserDto, users);
  }

  async findByEmail(email: string) {
    const user = await this.entityManager.findOneBy(User, { email });
    if (!user) {
      throw new UnauthorizedException("Email is wrong");
    }

    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.entityManager.findOneBy(User, { id });
    if (!user) {
      throw new UnauthorizedException("Email is wrong");
    }

    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto | Partial<UpdateUserDto>
  ) {
    return this.entityManager.update(User, id, updateUserDto);
  }

  async remove(id: number) {
    return await this.entityManager.delete(User, id);
  }
}
