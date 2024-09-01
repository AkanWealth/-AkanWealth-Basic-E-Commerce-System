import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Load environment variables
  app.setGlobalPrefix('api'); // Optional: Prefix all routes with 'api'

  // Swagger configuration
  const options = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('The e-commerce API description')
    .setVersion('1.0')
    .addTag('users')
    .addTag('products')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document); // Access Swagger UI at '/api/docs'

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000; // Default to 3000 if not set

  await app.listen(port);
}

bootstrap();
