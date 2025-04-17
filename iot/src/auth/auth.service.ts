import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User } from 'src/user/entities/user.entity';
import { compareHash, generateHash } from './util/handleBcrypt';
import { ErrorManager } from '../utils/error.manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async login(userLoginBody: LoginAuthDto) {
    try {
      const { email, password } = userLoginBody;

      // Buscar usuario por email
      const userExist = await this.userModel.findOne({ email }).select('+password').exec();

      if (!userExist) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Usuario no encontrado',
        });
      }

      // Verificar contraseña
      const isCheck = await compareHash(password, userExist.password);
      if (!isCheck) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Contraseña incorrecta',
        });
      }

      // Crear payload para los tokens
      const payload = { 
        email: userExist.email, 
        sub: userExist._id,
        role: userExist.role 
      };

      // Generar tokens
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });

      // Actualizar refresh token en la base de datos
      await this.userModel.findByIdAndUpdate(
        userExist._id,
        { refreshToken },
        { new: true }
      ).exec();

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: userExist._id,
          email: userExist.email,
          name: userExist.name,
          role: userExist.role
        }
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async register(userBody: RegisterAuthDto) {
    try {
      const { password, email, identity, ...userData } = userBody;

      // Verificar si el usuario ya existe
      const existingUser = await this.userModel.findOne({
        $or: [{ email }, { identity }]
      }).exec();

      if (existingUser) {
        throw new ErrorManager({
          type: 'CONFLICT',
          message: 'El correo o la identidad ya están registrados',
        });
      }

      // Crear nuevo usuario
      const newUser = new this.userModel({
        ...userData,
        email,
        identity,
        password: await generateHash(password),
        role: userBody.role || 'user' // Valor por defecto
      });

      await newUser.save();

      // Eliminar campos sensibles antes de retornar
      newUser.password = "";
      // newUser.refreshToken = undefined;

      return newUser;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verificar el refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Buscar usuario en la base de datos
      const user = await this.userModel.findOne({
        _id: payload.sub,
        refreshToken: refreshToken
      }).exec();

      if (!user) {
        throw new ErrorManager({
          type: 'UNAUTHORIZED',
          message: 'Refresh token inválido',
        });
      }

      // Generar nuevo access token
      const newPayload = { 
        email: user.email, 
        sub: user._id,
        role: user.role 
      };

      const newAccessToken = this.jwtService.sign(newPayload);

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).select('+password').exec();
    
    if (user && await compareHash(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }
}
