import { IsString, IsOptional, IsEnum, IsObject, IsMongoId } from 'class-validator';

export class CreateDeviceDto {
  @IsMongoId()
  companyId: string;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsObject()
  location?: { lat: number; lng: number };

  @IsOptional()
  @IsEnum(['online', 'offline'])
  status?: 'online' | 'offline';

  @IsOptional()
  lastSeen?: Date;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
