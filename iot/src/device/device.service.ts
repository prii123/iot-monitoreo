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
    const data = {
      ...dto,
      companyId: new Types.ObjectId(dto.companyId), // <-- conversión aquí
    };
    return this.deviceModel.create(data);
  }

  async findAll(companyId?: string): Promise<Device[]> {
    const filter = companyId 
      ? { 
          companyId: new Types.ObjectId(companyId),
          status: 'online'
        } 
      : { status: 'online' };
      
    return this.deviceModel.find(filter).exec();
  }

  // async findAllLoc(): Promise<Device[]> {
  //   return this.deviceModel.find().exec();
  // }

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

  async updateStatusToOffline(id: string): Promise<Device> {
    const device = await this.deviceModel.findByIdAndUpdate(
      id, 
      { status: 'offline' }, 
      { new: true }
    ).exec();
    
    if (!device) throw new NotFoundException('Device not found');
    return device;
  }

  async remove(id: string): Promise<void> {
    const result = await this.deviceModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Device not found');
  }

  async findInactiveDevices(): Promise<Device[]> {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  
    return this.deviceModel.find({
      status: 'online',  // Solo dispositivos marcados como online
      lastSeen: { $lt: tenMinutesAgo }  // Pero que no han sido vistos en los últimos 10 minutos
    }).exec();
  }


  async findAllByCompany(companyId: string) {
    const data = await this.deviceModel.find({ companyId: new Types.ObjectId(companyId) }).exec();
    // console.log(data)
    return data; 
  }
  

  
}
