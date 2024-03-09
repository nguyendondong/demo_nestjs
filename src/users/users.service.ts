import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@/database/entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto, responseUserDto } from "@/users/dto/create-user.dto";
import { ValidationException } from "@/exception/base.exception";
import { BcryptService } from "@/base/bcrypt.service";
import { transformDataEnitity } from "@/utils/TransformDataUtils";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private bycryptService: BcryptService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<responseUserDto> {
    try {
      const hashPassword = await this.bycryptService.hash(
        createUserDto.password
      );
      const user = await this.userRepository.save({
        ...createUserDto,
        password: hashPassword,
      });

      return transformDataEnitity(responseUserDto, user);
    } catch (error) {
      throw new ValidationException(error.detail, error.code);
    }
  }

  async findAll(): Promise<responseUserDto> {
    const users = await this.userRepository.find({
      order: {
        id: "DESC",
        name: "ASC",
      },
    });
    return transformDataEnitity(responseUserDto, users);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException("Email is wrong");
    }

    return user;
  }

  async findById(id: number): Promise<responseUserDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error("User not found");
    }

    return transformDataEnitity(responseUserDto, user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto | Partial<UpdateUserDto>
  ) {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
