import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module'
import { MongooseModule } from '@nestjs/mongoose';
// import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [UserController],
  providers: [UserService, AuthModule],
  // exports:[UserService]
})
export class UserModule {}
