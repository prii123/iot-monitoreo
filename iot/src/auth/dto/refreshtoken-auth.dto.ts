import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RefresTokenDTO {
  @ApiProperty()
  @IsNotEmpty()
  refresh_token: string;


}