import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './dto/user.dto';
import { ChangePasswordDto, RequestUser } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor (private userService: UserService){}

  
  @Post('register')
  register(@Body() user: User): Promise<User> {
    return this.userService.register(user)
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    console.log(id)
    return this.userService.findOne(Number(id))
  }

  @Get()
  async findAll():  Promise<User[]> {
    return this.userService.findAll()
  }

  @Delete(':id')
  async deletOne(@Param('id') id: string) :Promise<any> {
    return this.userService.deletOne(Number(id))
  }
  
  @Put(':id')  
  async updateOne(@Param('id') id: string, @Body() user: User): Promise<any> {
    return this.userService.updateOne(Number(id), user)

  }
  
  @Post('changePassword')
  async ChangePassword(@Req() req: RequestUser, @Body() changePasswordDto: ChangePasswordDto): Promise<void>{
    console.log(req)  
    const user = req.user;
      await this.userService.ChangePassword(user, changePasswordDto)
  }

}
