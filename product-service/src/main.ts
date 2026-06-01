import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Product Service API')
    .setDescription('Jomoro coffe V2 Product Service API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
