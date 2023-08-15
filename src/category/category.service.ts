import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto, FilterCatDto, UpdateCategoryDto } from './dto/category.dto';
import { User } from 'src/user/dto/user.dto';
import { BlogController } from 'src/blog/blog.controller';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
const slugify = require('slugify')

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly Repository: Repository<CategoryEntity>
  ){}

  async create(createCategory: CreateCategoryDto): Promise<CategoryEntity>{
    const slug = await this.generateSlug(createCategory.name)
    createCategory.slug = slug
    return await this.Repository.save(createCategory)
  }

  async paginateList(options: IPaginationOptions): Promise<Pagination<CategoryEntity>>{
    return paginate<CategoryEntity>(this.Repository, options, {
      relations: ['blogEntries'],
    })
  }

  async showOne(id: number): Promise<CategoryEntity>{
    return this.Repository.findOne({
      where:{id: id},
      relations: ['blogEntries']
    })
  }

  async updateOne(id: number, updateCategory: UpdateCategoryDto): Promise<CategoryEntity>{
    const existingCat = await this.showOne(id);
    // console.log(existingCat)
    if (!existingCat) {
      throw new NotFoundException('Category not found');
    }
    await this.Repository.update(id, updateCategory)
    return this.showOne(id)
  }

  async deleteOne(id: number): Promise<any>{
    return  this.Repository.delete(id) 
  }

  generateSlug(name: string): Promise<string>{
    return slugify(name)
  }

  //TÌM CÁCH NGẮN HƠN
  async getCategorys(filterDto: FilterCatDto): Promise<CategoryEntity[]> {
    const { name, search } = filterDto;
  
    const queryBuilder = this.Repository
      .createQueryBuilder('category')
      .innerJoinAndSelect('category.blogEntries', 'blogEntries');
  
    if (name) {
      queryBuilder.andWhere('category.name LIKE :name', { name: `%${name}%` });
    }
  
    if (search) {
      queryBuilder.andWhere(
        '(category.company LIKE :search OR blogEntries.title LIKE :search)',
        { search: `%${search}%` },
      );
    }
  
    const categorys = await queryBuilder.getMany();
    return categorys;
  }
}
