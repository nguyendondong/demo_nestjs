import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import FormatterError, { FormatterErrorType } from "@/exception/base.exception";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  i18nValidationErrorFactory,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from "nestjs-i18n";
import { HttpExceptionFilter } from "@/exception/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
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
      errorFormatter: (error) => {
        return FormatterError(error) as FormatterErrorType;
      },
    })
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });
  app.setGlobalPrefix("api");

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
