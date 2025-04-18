import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeviceModule } from './device/device.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://printsvallejos:A6dJ7ZcgiMVLKA5a@cluster0.o7pkfah.mongodb.net/?retryWrites=true&w=majority'), //mongodb://localhost:27017/iotdb  &appName=Cluster0
    CompaniesModule,
    DeviceModule,
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
