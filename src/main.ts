import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import * as YAML from 'yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔹 Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Custom Fields Service')
    .setDescription('API documentation for Custom Fields microservice')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Serve Swagger UI
  SwaggerModule.setup('api-docs', app, document);


  // JSON likhne ke baad
  writeFileSync('./openapi/openapi.json', JSON.stringify(document, null, 2));

  // ✅ YAML file bhi generate karo
  writeFileSync('./openapi/openapi.yaml', YAML.stringify(document));

  await app.listen(3000);
}
bootstrap();
