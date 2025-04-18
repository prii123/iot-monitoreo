import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CORS } from './constants';
import { json, urlencoded } from 'express';
const morgan = require('morgan');
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'))
  
  app.setGlobalPrefix('api')

     // Configuración básica de Swagger
     const config = new DocumentBuilder()
     .setTitle('API Documentation')
     .setDescription('API description')
     .setVersion('1.0')
     .addBearerAuth()
     .build();

     const document = SwaggerModule.createDocument(app, config);
     SwaggerModule.setup('api', app, document);
  app.enableCors(CORS);
  app.use(json({ limit: '10mb' })); // Establece el límite que necesites
  app.use(urlencoded({ limit: '10mb', extended: true })); // Para solicitudes multipart

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions:{
        enableImplicitConversion: true
      }
  }));


  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
bootstrap();
