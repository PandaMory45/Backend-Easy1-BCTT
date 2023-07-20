import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, UserEntity } from 'src/user/entities/user.entity';
import { User, UserRole } from 'src/user/dto/user.dto';
import { hasRole } from './decorator/roles.decorator';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @hasRole(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createrUser(@Body() user: User): Promise<any> {
    return this.authService.createUser(user)
  }

  @Post('login')
  async login(@Body() loginAuth: LoginAuthDto): Promise<object>{
    return this.authService.login(loginAuth)
  }
}
