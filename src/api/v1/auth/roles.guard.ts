import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { RolesName } from "src/api/base";
import { Reflector } from "@nestjs/core";
import { Roles } from "@/decorator/roles.decorator";
import Utils from "@/utils/Utils";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<RolesName[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const isValid = roles?.includes(user.role);

    if (!isValid) {
      throw new ForbiddenException(Utils.t("auth.permissionDenied"));
    }

    return isValid;
  }
}
