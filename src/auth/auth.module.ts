import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { UserEntity } from 'src/user/entities/user.entity';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt.guard';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/dto/user.dto';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => UserModule),
    JwtModule.register({}),
  ],
  controllers:[AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, JwtAuthGuard], 
  exports: [AuthService]
})
export class AuthModule {}
