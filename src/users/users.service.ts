import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "@/database/entities/user.entity";
import { EntityManager } from "typeorm";
import { CreateUserDto, ResponseUserDto } from "@/users/dto/create-user.dto";
import { ValidationException } from "@/exception/base.exception";
import { BcryptService } from "@/base/bcrypt.service";
import Helpers from "@/utils/TransformDataUtils";
import { BaseService } from "@/base/base.service";
import { SearchDto } from "@/users/dto/search.dto";
import { responsePagination } from "@/base/dto/pagination.dto";
import { BlobService } from "@/blob/blob.service";
import { Attachment } from "@/database/entities/attachment.entity";
import { MailService } from "@/mail/mail.service";

@Injectable()
export class UsersService extends BaseService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    protected readonly entityManager: EntityManager,
    private readonly blobService: BlobService,
    private readonly bcryptService: BcryptService,
    private readonly mailService: MailService
  ) {
    super(entityManager);
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    try {
      const hashPassword = await this.bcryptService.hash(
        createUserDto.password
      );
      const userData = this.entityManager.create(User, {
        ...createUserDto,
        password: hashPassword,
      });

      const user = await this.entityManager.save(User, userData);
      await this.mailService.sendUserConfirmation(user, "token");

      return Helpers.transformDataEnitity(ResponseUserDto, user);
    } catch (error) {
      throw new ValidationException(error.detail, error.code);
    }
  }

  async findAll(searchDto: SearchDto): Promise<responsePagination> {
    const users = await this.FindWithPagination(User, searchDto);

    return Helpers.transformDataEnitity(responsePagination, users);
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
      relations: ["attachments", "attachments.blob"],
    });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto | any,
    file?: Express.Multer.File
  ) {
    const user = await this.findById(id);
    if (file && (await this.blobService.uploadFile(file))) {
      const blob = await this.blobService.create(file);
      const hasAvatar = await this.entityManager.findOne(Attachment, {
        where: {
          relationId: user.id,
          relationType: "User",
          fieldName: file.fieldname,
        },
      });
      if (hasAvatar) {
        await this.entityManager.update(Attachment, hasAvatar.id, {
          blob,
        });
      } else {
        const attachment = this.entityManager.create(Attachment, {
          fieldName: file.fieldname,
          relationId: user.id,
          relationType: "User",
          blob,
        });
        await this.entityManager.save(Attachment, attachment);
      }
    }
    await this.entityManager.update(User, id, { ...updateUserDto });

    return true;
  }

  async remove(id: number) {
    return await this.entityManager.delete(User, id);
  }
}
