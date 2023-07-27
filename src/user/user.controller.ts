import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordDto, FilterDto, QueryDto, RequestUser, SearchDto, User, UserRole, } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
// import { hasRole } from '';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor (private userService: UserService){}

  
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'show info User' })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    console.log(id)
    return this.userService.findOne(Number(id))
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'show info all UserUser' })
  @Get()
  async findAll(@Query() filterDto: FilterDto):  Promise<User[]> {
    console.log(filterDto)
    if(Object.keys(filterDto).length)  {
      return this.userService.getUsers(filterDto)
    }
    else{
      return this.userService.findAll()
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'delete User' })
  @Delete(':id')
  async deletOne(@Param('id') id: string) :Promise<any> {
    return this.userService.deletOne(Number(id))
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update By User' })
  @Put(':id')  
  async updateOne(@Param('id') id: string, @Body() user: User): Promise<any> {
    return this.userService.updateOne(Number(id), user)

  }
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Change Password' })
  @Post('changePassword')
  async ChangePassword(@Req() req: RequestUser, @Body() changePasswordDto: ChangePasswordDto): Promise<void>{
    // console.log(req)  
    const user = req.user;
      await this.userService.ChangePassword(user, changePasswordDto)
  }
  
}
