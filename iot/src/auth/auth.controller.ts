import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RefresTokenDTO } from './dto/refreshtoken-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginAuthDto) {
    const user = await this.authService.login(loginDto);
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    return user;
  }

  @Post('register')
  async register(@Body() registerDto: RegisterAuthDto){
    return await this.authService.register(registerDto);

  }

  @Post('refresh-token')
  async refreshToken(@Body() body: RefresTokenDTO) {
    return this.authService.refreshToken(body.refresh_token);
  }


}

