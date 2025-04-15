import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) {}

  async create(dto: CreateCompanyDto): Promise<Company> {
    return this.companyModel.create(dto);
  }

  async findAll(): Promise<Company[]> {
    const data = await this.companyModel.find().exec();
    // console.log(data)
    return data;
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyModel.findById(id).exec();
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, dto: UpdateCompanyDto): Promise<Company> {
    const company = await this.companyModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async remove(id: string): Promise<void> {
    const result = await this.companyModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Company not found');
  }
}
