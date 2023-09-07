import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VoteEntity, VoteType } from './entities/votes.entity';
import { Repository } from 'typeorm';
import { BlogEntryEntity } from 'src/blog/entites/blog.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class VotesService {

  constructor(
    @InjectRepository(VoteEntity)
    private readonly voteRepo: Repository<VoteEntity>,
    @InjectRepository(BlogEntryEntity)
    private readonly postRepo: Repository <BlogEntryEntity>
  ){}

  // async upVote(user: UserEntity, postId: number): Promise<VoteEntity>{
  //   const post = await this.postRepo.findOne({
  //     where: {id: postId},
  //     relations: ['votes']
  //   });

  //   if(!post){
      
  //   }

  //   const existVote = post.votes.find(vote => vote.user.id === user.id) 
  //   if(existVote){
  //     if(existVote.typeVote === VoteType.Upvote){
  //       post.upVote--;
  //       await this.voteRepo.remove(existVote);
  //     }
  //   }
  //   else{
  //     post.upVote++;
  //     const newVote = new VoteEntity();
  //     newVote.user = user;
  //     newVote.post = post;
  //     newVote.typeVote = VoteType.Upvote;
  //     await this.voteRepo.save(newVote)
  //   }
  //   return this.postRepo.save(post)
  // }
  async findAll(): Promise<VoteEntity[]>{
    return this.voteRepo.find({relations: ['user', 'post']})
  }

  async getUserByVote(id: number): Promise<any>{
    const vote = await this.voteRepo.findOne({where: {id: id}, relations:['user']});

    return vote.user.id;
  }

}
