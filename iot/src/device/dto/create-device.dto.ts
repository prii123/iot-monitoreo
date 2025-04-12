import { IsString, IsOptional, IsEnum, IsObject, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeviceDto {
  
  @ApiProperty()
  @IsMongoId()
  companyId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  location?: { lat: number; lng: number };

  @ApiProperty()
  @IsOptional()
  @IsEnum(['online', 'offline'])
  status?: 'online' | 'offline';

  @ApiProperty()
  @IsOptional()
  lastSeen?: Date;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
