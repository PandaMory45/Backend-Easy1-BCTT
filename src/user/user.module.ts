import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MediaEntity } from 'src/media/entities/media.entity';
import { MediaService } from 'src/media/media.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity, MediaEntity]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, MediaService],
  exports: [UserService, ]
})
export class UserModule {}
