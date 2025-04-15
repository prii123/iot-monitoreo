import { IsEmail, IsNotEmpty, Length, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterAuthDto {
  [x: string]: string;
  @ApiProperty()
  @IsNotEmpty()
  // @Length(1-100)
  readonly identity: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(1-100)
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Length(1-100)
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3-100)
  readonly password: string;


}