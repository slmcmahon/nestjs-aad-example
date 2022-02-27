import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Places API")
    .setDescription("Stores information about places")
    .setVersion("1.0")
    .addBearerAuth({
      description: "Please provide a valid Bearer token",
      name: "Authorization",
      bearerFormat: "Bearer",
      scheme: "Bearer",
      type: "http",
      in: "Header"
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("/", app, document);

  await app.listen(3000);
}
bootstrap();
