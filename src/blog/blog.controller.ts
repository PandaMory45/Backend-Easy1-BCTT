import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BlogDto } from './dto/blog.dto';
import { BlogService } from './blog.service';
import { RequestUser } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserIsAuthor } from './guard/user-is-author.guard';

@UseGuards(JwtAuthGuard)
@Controller('blog')
export class BlogController {
  
  constructor(private blogService: BlogService) {}
  
  @Post()
  create(@Body()blogEntry: BlogDto, @Req() req: RequestUser): Promise<BlogDto> {
      const user = req.user;
      return this.blogService.create(user, blogEntry);
  }

  @Get()
  findBlogEntries(@Query('userId') userId: number): Promise<BlogDto[]>{
    if(userId == null){
      return this.blogService.findAll();
    } else {
      return this.blogService.findByUser(userId)
    }
  }

  @Put(':id')
  @UseGuards(UserIsAuthor)
  updateOne(@Param('id') id: number, @Body() blog: BlogDto): Promise<BlogDto>{
    return this.blogService.updateOne(Number(id), blog)
  }

  @Delete(':id')
  deleteOne(@Param('id') id: number): Promise<any>{
    return this.blogService.deleteOne(id)
  }
}
