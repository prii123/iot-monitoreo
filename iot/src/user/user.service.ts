import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UserToCompanyDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { generateHash } from '../auth/util/handleBcrypt';
import { ErrorManager } from '../utils/error.manager';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await generateHash(createUserDto.password);
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword
      });
      return await newUser.save();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async relationToCompany(body: UserToCompanyDTO) {
    try {
      const user = await this.userModel.findById(body.userId);
      if (!user) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Usuario no encontrado',
        });
      }

      // Agregar la compañía al array de companies del usuario
      user.companies = user.companies || [];
      user.companies.push(body.companyId);
      return await user.save();
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findOne(id: string) {
    try {
      const user = await this.userModel.findById(id)
        .populate('companies') // Asumiendo que tienes relación con companies
        .exec();

      if (!user) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontró resultado',
        });
      }
      return user;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }


//  async update(id: string, updateUserDto: UpdateUserDto) {
//     try {
//       if (updateUserDto.password) {
//         updateUserDto.password = await generateHash(updateUserDto.password);
//       }

//       const updatedUser = await this.userModel.findByIdAndUpdate(
//         id,
//         updateUserDto,
//         { new: true } // Devuelve el documento actualizado
//       ).exec();

//       if (!updatedUser) {
//         throw new ErrorManager({
//           type: 'BAD_REQUEST',
//           message: 'Usuario no encontrado',
//         });
//       }

//       return updatedUser;
//     } catch (error) {
//       throw ErrorManager.createSignatureError(error.message);
//     }
//   }

  async remove(id: string) {
    try {
      const result = await this.userModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Usuario no encontrado',
        });
      }
      return true;
    } catch (error) {
      throw ErrorManager.createSignatureError(error.message);
    }
  }
}