import { Reflector } from "@nestjs/core";
import { RolesName } from "@/base";

export const Roles = Reflector.createDecorator<RolesName[]>();
