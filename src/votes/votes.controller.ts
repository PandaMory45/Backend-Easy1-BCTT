import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { VotesService } from './votes.service';
import { RequestUser } from 'src/user/dto/user.dto';
import { VoteEntity } from './entities/votes.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('votes')
export class VotesController {
  constructor(
    private readonly votesSevice: VotesService
  ){}
  
  @Get()
  async findAll(): Promise<VoteEntity[]>{
    return this.votesSevice.findAll()
  }
}
