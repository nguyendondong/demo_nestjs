import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "@/exception/http-exception.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  i18nValidationErrorFactory,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from "nestjs-i18n";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: i18nValidationErrorFactory,
    }),
    new I18nValidationPipe()
  );
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new I18nValidationExceptionFilter({
      errorFormatter: (dataError) => {
        console.log(dataError);
        return dataError;
        // return {
        //   message: error.message,
        //   code: error.code,
        // };
      },
    })
  );

  const config = new DocumentBuilder()
    .setTitle("NestJS Demo API")
    .setDescription("List API NestJS Demo API")
    .setVersion("1.0")
    .addTag("Auth")
    .addTag("User")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  await app.listen(3000);
}

bootstrap();
