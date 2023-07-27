import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from 'src/category/dto/category.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>
  ){}

  async create(createCompany: CreateCategoryDto): Promise<CompanyEntity>{
    const exist = this.companyRepository.create(createCompany)
    return this.companyRepository.save(exist)
  }

  async findByName(){

  }

  async list(){

  }
}
