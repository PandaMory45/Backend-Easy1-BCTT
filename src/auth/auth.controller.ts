import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { LoginAuthDto, RegisterUser, User, UserRole } from 'src/user/dto/user.dto';
import { hasRole } from './decorator/roles.decorator';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @hasRole(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo tài khoản bởi admin' })
  @Post('')
  async createrUser(@Body() user: RegisterUser): Promise<any> {
    return this.authService.createUser(user)
  }

  @Post('register')
  @ApiOperation({ summary: 'Tạo tài khoản bởi User' })
  register(@Body() user: RegisterUser): Promise<User> {
    return this.authService.registerUser(user)
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập' })
  async login(@Body() loginAuth: LoginAuthDto): Promise<object>{
    // console.log(loginAuth)
    return this.authService.login(loginAuth)
  }
}
