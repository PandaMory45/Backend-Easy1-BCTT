import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntryEntity } from './entites/blog.entity';
import { Repository } from 'typeorm';
import { BlogDto } from './dto/blog.dto';
import { User } from 'src/user/dto/user.dto';

const slugify = require('slugify')

@Injectable()
export class BlogService {
  
  constructor(
    @InjectRepository(BlogEntryEntity)  private readonly blogRepository: Repository<BlogEntryEntity>
  ){}

  async create(user: User, blog: BlogDto): Promise<BlogDto>{
    blog.author = user;
    // console.log(user)
    const slug = await this.generateSlug(blog.title)
    blog.slug = slug
    // console.log(slug)
    return await this.blogRepository.save(blog)
  }

  async findAll(): Promise<BlogDto[]>{
    return this.blogRepository.find({relations: ['author']})
  }

  async findOne(id: number): Promise<BlogDto>{
    return await this.blogRepository.findOne({where:{id: id}, relations: ['author'],})
  }

  async findByUser(userId: any): Promise<BlogDto[]>{
    return await this.blogRepository.find({
      where:[
        {author: userId}
      ],
      relations: ['author'],
    })
  }
  //Update Post
  async updateOne(id: number, blog: BlogDto): Promise<BlogDto>{
    const existingBlog = await this.blogRepository.findOne({where:{id: id}});
    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }
  
    await this.blogRepository.update(id, blog)

    return this.blogRepository.findOne({where:{id: id}})
  }
  //Delete Post
  async deleteOne(id: number): Promise<any>{
    return this.blogRepository.delete(id)
  }

  generateSlug(title: string): Promise<string>{
    return slugify(title)
  }
}
