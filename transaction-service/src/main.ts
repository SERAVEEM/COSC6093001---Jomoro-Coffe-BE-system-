import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule} from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
  .setTitle('Transaction Service')
  .setDescription('Jomoro Coffe v2 transaction Service API Documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build()

  const document = SwaggerModule.createDocument(app, config) ;
  SwaggerModule.setup('api', app, document)
  

  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
