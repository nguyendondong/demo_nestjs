import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "@/database/entities/user.entity";
import { EntityManager } from "typeorm";
import { CreateUserDto, ResponseUserDto } from "@/users/dto/create-user.dto";
import { BcryptService } from "@/base/bcrypt.service";
import Helpers from "@/utils/TransformDataUtils";
import { BaseService } from "@/base/base.service";
import { SearchDto } from "@/users/dto/search.dto";
import { responsePagination } from "@/base/dto/pagination.dto";
import { BlobService } from "@/blob/blob.service";
import { Attachment } from "@/database/entities/attachment.entity";
import { MailService } from "@/mail/mail.service";
import Utils from "@/utils/Utils";
import { jwtConstants } from "@/auth/constants";
import { JwtService } from "@nestjs/jwt";
import { RolesName } from "@/base";

@Injectable()
export class UsersService extends BaseService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    protected readonly entityManager: EntityManager,
    private readonly blobService: BlobService,
    private readonly bcryptService: BcryptService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService
  ) {
    super(entityManager);
  }

  async create(
    lang: string,
    createUserDto: CreateUserDto
  ): Promise<ResponseUserDto> {
    const { email, password } = createUserDto;
    const userExists = await this.entityManager.existsBy(User, {
      email: email,
    });
    if (userExists) {
      throw new BadRequestException(Utils.t("user.emailAlreadyExists"));
    }
    const hashPassword = await this.bcryptService.hash(password);
    const confirmationToken = await this.bcryptService.hash(email);
    const userData = this.entityManager.create(User, {
      ...createUserDto,
      password: hashPassword,
      confirmationToken,
    });

    const user = await this.entityManager.save(User, userData);
    const mailToken = await this.generateRandomToken(email, confirmationToken);
    await this.mailService.sendEmailConfirmation(lang, user, mailToken);

    return Helpers.transformDataEnitity(ResponseUserDto, user);
  }

  async findAll(searchDto: SearchDto): Promise<responsePagination> {
    const users = await this.FindWithPagination(User, searchDto);

    return Helpers.transformDataEnitity(responsePagination, users);
  }

  async findByEmail(email: string) {
    const user = await this.entityManager.findOneBy(User, {
      email,
    });
    if (!user) {
      throw new UnauthorizedException("Email is wrong");
    }

    return user;
  }

  async findById(id: number, { withBlob = false }): Promise<User> {
    const user = await this.entityManager.findOne(User, {
      where: {
        id,
      },
      relations: {
        attachments: {
          blob: withBlob,
        },
      },
    });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return user;
  }

  async findByToken(token: string): Promise<User> {
    const verify = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });

    if (!verify) {
      throw new UnauthorizedException("Token invalid");
    }

    const { email, confirmationToken } = verify;
    const user = await this.entityManager.findOne(User, {
      where: {
        email,
        confirmationToken,
        role: RolesName.INVALID_USER,
      },
    });
    if (!user) {
      throw new UnauthorizedException("Token invalid");
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto | any,
    file?: Express.Multer.File
  ) {
    const user = await this.findById(id, { withBlob: false });
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

  private async generateRandomToken(
    email: string,
    confirmationToken: string
  ): Promise<string> {
    const payload = {
      email: email,
      confirmationToken: confirmationToken,
    };

    return await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: jwtConstants.expiresIn,
    });
  }
}
