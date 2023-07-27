import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntryEntity } from './entites/blog.entity';
import { Repository } from 'typeorm';
import { BlogDto } from './dto/blog.dto';
import { User } from 'src/user/dto/user.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CategoryService } from 'src/category/category.service';
import { CategoryEntity } from 'src/category/entities/category.entity';

const slugify = require('slugify')

@Injectable()
export class BlogService {
  
  constructor(
    @InjectRepository(BlogEntryEntity)  private readonly blogRepository: Repository<BlogEntryEntity>,
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,


  ){}

  async create(user: User, blogDto: BlogDto): Promise<BlogDto>{
    blogDto.author = user;
    const slug = await this.generateSlug(blogDto.title)
    blogDto.slug = slug
    const category = await this.categoryRepository.findOne({where: {name: blogDto.category.name}});
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    blogDto.category = category
    return await this.blogRepository.save(blogDto)
  }

  async findAll(): Promise<BlogDto[]>{
    return this.blogRepository.find({relations: ['author','category']})
  }

  async findOne(id: number): Promise<BlogDto>{
    return await this.blogRepository.findOne({where:{id: id}, relations: ['author', 'category'],})
  }

  async findByUser(userId: any): Promise<BlogDto[]>{
    return await this.blogRepository.find({
      where:[
        {author: userId}
      ],
      relations: ['author', 'category'],
    })
  }

  // Phân trang
  async paginateAll(options: IPaginationOptions): Promise<Pagination<BlogDto>>{
    return paginate<BlogEntryEntity>(this.blogRepository, options, {
      relations: ['author', 'category'],
    })
  }

  async paginateByUser(options: IPaginationOptions, userId: number): Promise<Pagination<BlogDto>>{
    return paginate<BlogEntryEntity>(this.blogRepository, options, {

      relations: ['author', 'category'],
      where: [
        {author: {id: userId}}
      ],
    })
  }

  //Update Post
  async updateOne(id: number, blog: BlogDto): Promise<BlogDto>{
    const existingBlog = await this.blogRepository.findOne({where:{id: id}});
    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }
  
    await this.blogRepository.update(id, blog)

    return this.findOne(id)
  }
  //Delete Post
  async deleteOne(id: number): Promise<any>{
    return this.blogRepository.delete(id)
  }

  generateSlug(title: string): Promise<string>{
    return slugify(title)
  }
}
