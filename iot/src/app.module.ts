import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeviceModule } from './device/device.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/iotdb'), //mongodb://localhost:27017
    CompaniesModule,
    DeviceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
