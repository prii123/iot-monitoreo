import { IsNotEmpty, Length, IsEmail, IsString, IsNumber, IsEnum } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { ROLES } from "src/constants/roles";
import { Types } from 'mongoose';

export class CreateUserDto {
    @ApiProperty({
        example: 'Juan Pérez',
        description: 'Nombre completo del usuario'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 100)
    readonly name: string;

    @ApiProperty({
        example: 123456789,
        description: 'Número de identificación único'
    })
    @IsNotEmpty()
    @IsNumber()
    readonly identity: number;

    @ApiProperty({
        example: 'usuario@example.com',
        description: 'Correo electrónico válido'
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'Contraseña segura'
    })
    @IsNotEmpty()
    @IsString()
    @Length(8, 64)
    readonly password: string;

    @ApiProperty({
        enum: ROLES,
        example: ROLES.BASIC,
        description: 'Rol del usuario en el sistema'
    })
    @IsNotEmpty()
    @IsEnum(ROLES)
    readonly role: ROLES;
}

export class UserToCompanyDTO {
    @ApiProperty({
        type: String,
        example: '507f1f77bcf86cd799439011',
        description: 'ID del usuario en MongoDB'
    })
    @IsNotEmpty()
    @IsString()
    userId: Types.ObjectId;

    @ApiProperty({
        type: String,
        example: '507f1f77bcf86cd799439012',
        description: 'ID de la compañía en MongoDB'
    })
    @IsNotEmpty()
    @IsString()
    companyId: Types.ObjectId;

    // @ApiProperty({
    //     enum: ACCESS_LEVEL,
    //     example: ACCESS_LEVEL.MAINTAINER,
    //     description: 'Nivel de acceso del usuario en la compañía'
    // })
    // @IsNotEmpty()
    // @IsEnum(ACCESS_LEVEL)
    // accessLevel: ACCESS_LEVEL;
}