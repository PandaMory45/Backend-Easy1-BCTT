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

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => UserModule),
    // ConfigModule.forRoot(),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => ({
    //     secret: config.get<string>('SECRET_KEY'),
    //     signOptions: {  expiresIn: '100s' },
    //   }),
    // }),
    JwtModule.register({}),
  ],
  controllers:[AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, JwtAuthGuard], 
  exports: [AuthService]
})
export class AuthModule {}
