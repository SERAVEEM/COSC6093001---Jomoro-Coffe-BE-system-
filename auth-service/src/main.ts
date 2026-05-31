import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';  


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
  .setTitle('authserivce')
  .setDescription('Jomoro Koffee V2 Auth Service API Documentattion')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const Documentattion = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, Documentattion);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
