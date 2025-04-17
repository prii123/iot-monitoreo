import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { DevicesService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';


@UseGuards(JwtAuthGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) { }



  @Get('inactive')
  async getInactiveDevices(): Promise<Device[]> {
    return this.devicesService.findInactiveDevices();
  }


  @Post()
  create(@Body() dto: CreateDeviceDto) {
    // console.log(dto)
    return this.devicesService.create(dto);
  }

  @Get()
  findAll(@Query('companyId') companyId?: string) {
    return this.devicesService.findAll(companyId);
  }

  // @Get("loc")
  // findAllLoc(){
  //   return this.devicesService.findAllLoc();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devicesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDeviceDto) {
    return this.devicesService.update(id, dto);
  }

  @Patch('updateOffline/:id')
  updateOffline(@Param('id') id: string) {
    return this.devicesService.updateStatusToOffline(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.devicesService.remove(id);
  }

  @Get('company/:companyId')
  findByCompany(@Param('companyId') companyId: string) {
    return this.devicesService.findAllByCompany(companyId);
  }



}
