import { Module } from '@nestjs/common';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteEntity } from './entities/votes.entity';
import { BlogEntryEntity } from 'src/blog/entites/blog.entity';

@Module({
  imports:[TypeOrmModule.forFeature([VoteEntity, BlogEntryEntity])],
  controllers: [VotesController],
  providers: [VotesService]
})
export class VotesModule {}
