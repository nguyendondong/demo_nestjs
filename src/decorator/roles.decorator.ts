import { Reflector } from "@nestjs/core";
import { RolesName } from "src/api/base";

export const Roles = Reflector.createDecorator<RolesName[]>();
