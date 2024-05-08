import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import helmet from "helmet";
import * as compression from "compression";
import basicAuth from "express-basic-auth";

import { AppModule } from "@/app/app.module";
import { GlobalExceptionFilter } from "@/filters";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 10000;

  console.log("WILL-RUN-ON-PORT: ", port);

  /**
   * Global configuration
   */
  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(compression());
  app.enableCors({
    origin: "*",
  });
  app.use(helmet({ contentSecurityPolicy: false }));

  /**
   * Global filters
   */
  app.useGlobalFilters(new GlobalExceptionFilter());

  /**
   * Require login to view api documentation in production env
   */
  // if (process.env.NODE_ENV === 'production') {
  //   app.use(
  //     ['/docs'],
  //     basicAuth({
  //       challenge: true,
  //       users: {
  //         admin: 'admin',
  //       },
  //     }),
  //   );
  // }

  /**
   * Swagger configuration
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle("API Documentation")
    .setDescription("Automatically generated API documentation")
    .setVersion("1.0")
    .setExternalDoc("Export API documentation as json file", "docs/api/download")
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup("docs/api", app, swaggerDocument, {customSiteTitle: "OIE Swagger API Documentation"});

  await app.listen(port);
}
bootstrap();
