import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DevicesService } from './device.service';
import { DevicesController } from './device.controller';
import { Device, DeviceSchema } from './entities/device.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }])],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DeviceModule {}
