import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "@/api/v1/auth/constants";
import { Request } from "express";
import { EntityManager, Not } from "typeorm";
import { User } from "@/database/entities/user.entity";
import { RolesName } from "src/api/base";
import Utils from "@/utils/Utils";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    protected readonly entityManager: EntityManager
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });

    if (!payload) {
      throw new UnauthorizedException();
    }
    const user = await this.entityManager.existsBy(User, {
      id: payload.user_id,
      role: Not(RolesName.INVALID_USER),
    });
    if (!user) {
      throw new ForbiddenException(Utils.t("auth.invalidTokenOrUserInactive"));
    }
    request.user = payload;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
