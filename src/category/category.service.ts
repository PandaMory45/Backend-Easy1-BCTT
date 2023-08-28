import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { CreateCategoryDto, FilterCatDto, UpdateCategoryDto } from './dto/category.dto';
import { User } from 'src/user/dto/user.dto';
import { BlogController } from 'src/blog/blog.controller';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { BlogEntryEntity } from 'src/blog/entites/blog.entity';
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
  //Xóa 1 chuyên mục
  async deleteOne(id: number): Promise<any>{
    return  this.Repository.delete(id) 
  }
  
   //Xóa nhiều chuyên mục
  async deleteMutiple(ids: string[]):Promise<DeleteResult>{
    return await this.Repository.delete({id: In(ids)});
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

  //Đếm số bài post sử dụng cùng một chuyên mục
  async getPostCountByCate(id: number): Promise<number>
  { 
    const category = await this.showOne(id);
    if(!category){
      return 0;
    }
    return category.blogEntries.length;
  }

    //Lấy tất cả chuyên mục
    async paginate(options: IPaginationOptions): Promise<Pagination<CategoryEntity>> {
      const queryBuilder = this.Repository.createQueryBuilder('category');
      return paginate<CategoryEntity>(queryBuilder, options);
    }

    //Lấy những chuyên mục có các kí tự giống ở phần "name" giống với Input
    async paginateFilterByName(options: IPaginationOptions, name: string): Promise<Pagination<CategoryEntity>> {
      const queryBuilder = this.Repository.createQueryBuilder('category');
      queryBuilder.where(`category.name LIKE :name`, { name: `%${name}%` });
      return paginate<CategoryEntity>(queryBuilder, options);
    }
    
    //Lấy những chuyên mục có các kí tự giống ở phần "company" giống với Input
    async paginateFilterByCompany(options: IPaginationOptions, company: string): Promise<Pagination<CategoryEntity>> {
      const queryBuilder = this.Repository.createQueryBuilder('category');
      queryBuilder.where(`category.company LIKE :company`, { company: `%${company}%` });
      return paginate<CategoryEntity>(queryBuilder, options);
    }

    //Lấy những chuyên mục được tạo vào mốc thời gian được chỉ định
    async paginateFilterByDate(options: IPaginationOptions, createAt: Date):Promise<Pagination<CategoryEntity>>{
      const queryBuilder = this.Repository.createQueryBuilder('category');
      queryBuilder.where(`category.createAt >= :createAt`, { createAt });
      return paginate<CategoryEntity>(queryBuilder, options);
    }
}
