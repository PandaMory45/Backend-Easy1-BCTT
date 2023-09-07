import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BlogDto, FilterBlogDto, QueryPostDto, UpdatePost } from './dto/blog.dto';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserIsAuthor } from './guard/user-is-author.guard';
import passport from 'passport';
import { RequestUser } from 'src/user/dto/user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { BlogEntryEntity } from './entites/blog.entity';
import { identity } from 'rxjs';

export const BLOG_URL = 'http://localhost:3000/blog'
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  
  constructor(private blogService: BlogService) {}
  
  @ApiOperation({ summary: 'Create a new Post' })
  @Post()
  create(@Body()blogEntry: BlogDto, @Req() req: RequestUser): Promise<BlogDto> {
      const user = req.user;
      return this.blogService.create(user, blogEntry);
  }

  @Get('/search')
  findBlogEntries(@Query('') filterDto: FilterBlogDto): Promise<BlogDto[]>{
    return this.blogService.getBlogEnties(filterDto)

  }

  @ApiOperation({ summary: 'Paginate Search all Post' })
  @Get('')
  index(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number =10
  ){
    pageSize = pageSize > 100 ? 100 : pageSize

    return this.blogService.paginateAll({
      limit: Number(pageSize),
      page: Number(page),
      route: BLOG_URL,
    })
  }
  
  @Get('user/:user')
  @ApiOperation({ summary: 'Paginate Search ' })
  indexByUser(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number =10,
    @Param('user') userId: number
  ){
    pageSize = pageSize > 100 ? 100 : pageSize

    return this.blogService.paginateByUser({
      limit: Number(pageSize),
      page: Number(page),
      route: BLOG_URL + '/user/' + userId,
    }, Number(userId))
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a Post' })
  // @UseGuards(UserIsAuthor)
  updateOne(@Param('id') id: number, @Body() blog: UpdatePost): Promise<BlogDto>{

    return this.blogService.updateOne(Number(id), blog)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Post' })
  @UseGuards(UserIsAuthor)
  deleteOne(@Param('id') id: number): Promise<any>{
    return this.blogService.deleteOne(id)
  }

  @Get("paginate")
  @ApiOperation({ summary: 'Get all Post' })
  async indexQ(@Query() queryDto: QueryPostDto): Promise<Pagination<BlogEntryEntity>> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;

    if (queryDto.title) {
      return await this.blogService.paginateFilterByTitle(
        {
          page,
          limit,
          route: 'http://localhost:3000/blog/paginate',
        },
        queryDto.title,
      );
    } 
    if(queryDto.createAt)
    {
      return await this.blogService.paginateFilterByDate(
        {
        page,
        limit,
        route: 'http://localhost:3000/blog/paginate',
      },
      queryDto.createAt,
      );
    }
    else{
      return await this.blogService.paginate(
        {
        page,
        limit,
        route: 'http://localhost:3000/blog/paginate',
      })
    }
  }
  
  @Post(':id')
  async upvote(@Req() req: RequestUser, @Param('id') postId: number):Promise<BlogEntryEntity>{
    const user = req.user;
    return this.blogService.upvotePost(user, postId);
  }
}
