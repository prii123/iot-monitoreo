import { IsNotEmpty, Length, IsEmail, IsString, IsNumber, IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { ROLES } from "src/constants/roles";

export class UpdateUserDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @Length(1 - 100)
    readonly name: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Length(1 - 100)
    readonly identity: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @IsEmail()
    @Length(1 - 100)
    readonly email: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Length(1 - 100)
    readonly password: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(ROLES)
    roles: ROLES

}