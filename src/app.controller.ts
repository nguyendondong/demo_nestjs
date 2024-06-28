import { Controller, Get } from "@nestjs/common";

@Controller("heath-check")
export class AppController {
  @Get()
  get() {
    return {
      status: "ok",
    };
  }
}
