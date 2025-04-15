import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { User, UserSchema } from 'src/user/entities/user.entity'; 
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mySecretKey', // Asegúrate de poner una clave secreta en el .env
      signOptions: {
        expiresIn: '3600s', // Tiempo de expiración del token (1 hora)
      },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService], // Exportamos el AuthService para usarlo en otros módulos si es necesario
})
export class AuthModule {}

