import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntryEntity } from './entites/blog.entity';
import { Repository } from 'typeorm';
import { BlogDto, FilterBlogDto } from './dto/blog.dto';
import { User } from 'src/user/dto/user.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CategoryService } from 'src/category/category.service';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { VoteEntity, VoteType } from 'src/votes/entities/votes.entity';
import { VotesService } from 'src/votes/votes.service';

const slugify = require('slugify')

@Injectable()
export class BlogService {
  
  constructor(
    @InjectRepository(BlogEntryEntity)  private readonly blogRepository: Repository<BlogEntryEntity>,
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(VoteEntity) private readonly voteRepository: Repository<VoteEntity>,
    private readonly voteSevice: VotesService

  ){}

  async create(user: User, blogDto: BlogDto): Promise<BlogDto>{
    blogDto.author = user;
    const slug = await this.generateSlug(blogDto.title)
    blogDto.slug = slug
    const category = await this.categoryRepository.findOne({
      where: {name: blogDto.category.name}}
      );
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    blogDto.category = category
    return await this.blogRepository.save(blogDto)
  }

  async findAll(): Promise<BlogDto[]>{
    return this.blogRepository.find({relations: ['author','category']})
  }

  async findOne(id: number): Promise<BlogEntryEntity>{
    return await this.blogRepository.findOne({where:{id: id}})
  }

  async getBlogEnties(filter: FilterBlogDto):Promise<BlogEntryEntity[]>{
    const { title, search, createAt } = filter;
  
    const queryBuilder = this.blogRepository
      .createQueryBuilder('blog_entry')
      .leftJoinAndSelect('blog_entry.category', 'category')
      .leftJoinAndSelect('blog_entry.author', 'author')
    
    if (title) {
      queryBuilder.andWhere('blog_entry.title LIKE :title', { title: `%${title}%` });
    }
    if(createAt){
      queryBuilder.andWhere('DATE(blog_entry.createAt) = DATE(:createAt)', {
        createAt,
      });
    }
    if (search) {
      queryBuilder.andWhere(
        '(blog_entry.description LIKE :search OR category.name LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const blogs = await queryBuilder.getMany();
    return blogs;
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
    const existingBlog = await this.findOne(id)
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
  //paginate
  async paginate(options: IPaginationOptions): Promise<Pagination<BlogEntryEntity>> {
    const queryBuilder = this.blogRepository.createQueryBuilder('blog_entry');
    return paginate<BlogEntryEntity>(queryBuilder, options);
  }

  async paginateFilterByTitle(options: IPaginationOptions, title: string): Promise<Pagination<BlogEntryEntity>> {
    const queryBuilder = this.blogRepository.createQueryBuilder('blog_entry');
    queryBuilder.where(`blog_entry.title LIKE :title`, { title: `%${title}%` });
    return paginate<BlogEntryEntity>(queryBuilder, options);
  }

  async paginateFilterByDate(options: IPaginationOptions, createAt: Date):Promise<Pagination<BlogEntryEntity>>{
    const queryBuilder = this.blogRepository.createQueryBuilder('blog_entry');
    queryBuilder.where(`blog_entry.createAt >= :createAt`, { createAt });
    return paginate<BlogEntryEntity>(queryBuilder, options);
  }

  async upvotePost(userLike: UserEntity, postId: number): Promise<BlogEntryEntity> {
    const post = await this.blogRepository.findOne({
      where: {id: postId},
      relations: ['votes', 'votes.user']
    });
    if (!post) {
        throw new NotFoundException('Post not found');
    }
    // const ex = post.votes.find(votes => votes.user.id)
    // console.log(ex)
    console.log(post)
    const existingVote = post.votes.find(votes => votes.user.id === userLike.id);
    if (existingVote) {
        // Cancel vote if already upvoted
        if (existingVote.typeVote === VoteType.Upvote) {
            post.upVote--;
            await this.voteRepository.remove(existingVote);
        }
    } else {
      post.upVote++;

      const newVote = new VoteEntity();
      newVote.user = userLike;
      newVote.typeVote = VoteType.Upvote;
  
      // Save the new vote entity
      const savedVote = await this.voteRepository.save(newVote);
  
      // Establish the relationship between post and savedVote
      post.votes.push(savedVote);
  
      // Save the updated post
      await this.blogRepository.save(post);
      
    }
    
    return post;
  }

  generateSlug(title: string): Promise<string>{
    return slugify(title)
  }
}
