import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BcryptService {
  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(value, salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }
}
