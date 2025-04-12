import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DevicesService {
  constructor(@InjectModel(Device.name) private deviceModel: Model<Device>) {}

  async create(dto: CreateDeviceDto): Promise<Device> {
    return this.deviceModel.create(dto);
  }

  async findAll(companyId?: string): Promise<Device[]> {
    const filter = companyId ? { companyId: new Types.ObjectId(companyId) } : {};
    return this.deviceModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Device> {
    const device = await this.deviceModel.findById(id).exec();
    if (!device) throw new NotFoundException('Device not found');
    return device;
  }

  async update(id: string, dto: UpdateDeviceDto): Promise<Device> {
    const device = await this.deviceModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!device) throw new NotFoundException('Device not found');
    return device;
  }

  async remove(id: string): Promise<void> {
    const result = await this.deviceModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Device not found');
  }
}
