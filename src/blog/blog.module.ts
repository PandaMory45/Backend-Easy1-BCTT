import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { BlogEntryEntity } from './entites/blog.entity';
import { UserIsAuthor } from './guard/user-is-author.guard';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { VoteEntity } from 'src/votes/entities/votes.entity';
import { VotesService } from 'src/votes/votes.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([BlogEntryEntity, CategoryEntity, VoteEntity]),
    AuthModule,
    UserModule
  ],
  controllers: [BlogController],
  providers: [BlogService, UserIsAuthor, VotesService],
  exports: [BlogService, ]
})
export class BlogModule {}
