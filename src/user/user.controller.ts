import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordDto, FilterDto, QueryDto, RegisterUser, RequestUser, SearchDto, UploadAvatar, User, UserRole, } from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { storageConfig } from 'src/helpers/config';
import { hasRole } from 'src/auth/decorator/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { RolesGuard } from 'src/auth/roles.guard';
import { MediaService } from 'src/media/media.service';
import { extname } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { identity } from 'rxjs';
import { MediaEntity } from 'src/media/entities/media.entity';
// import { hasRole } from '';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor (
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private userService: UserService,
    private mediaService: MediaService,
    ){}
    
  @Post('register')
  @ApiOperation({ summary: 'Tạo tài khoản bởi User' })
  register(@Body() user: RegisterUser): Promise<User> {
    return this.userService.registerUser(user)
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'show info User' })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(Number(id))
  }

  @Put('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('images', {
    storage: storageConfig('images'),
    fileFilter:(req, file, cb) =>{
      const ext =  extname(file.originalname);
      const allowedExtArr = ['.jpg', '.png', '.jpeg' , '.JPG', '.PNG'];
      if(!allowedExtArr.includes(ext)){
        req.fileValidationError = `Wrong extention type. Accepted file ext are: ${allowedExtArr.toString()}`;
        cb(null, false)
    }
        cb(null, true);
      // }
    }
  }),
  )
  @ApiOperation({ summary: 'show info User' })
  // @Post(':id')
  async testAva(
    @Query() uploadAva: UploadAvatar, 
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File
    ): Promise<any> {
    const user = req.user;
    if (uploadAva.pictureId) {
      return this.userService.set(user, uploadAva);
    }

    if (file) {
      const newAvatar = await this.mediaService.uploadImage(user, file);
      user.avatar = newAvatar;
      await this.userRepository.save(user);
    }
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
  @hasRole(UserRole.ADMIN)
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
  async ChangePassword(@Req() req: RequestUser, 
  @Body() changePasswordDto: ChangePasswordDto
  ): Promise<void>{
    // console.log(req)  
    const user = req.user;
    console.log(user)
    await this.userService.ChangePassword(user, changePasswordDto)
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('avatar/:id')
  // // @UseInterceptors(FileInterceptor('images', { storage: storageConfig('images') }))
  // async UploadAvatar(@Req() req: RequestUser, @Param('id') pictureId: number):Promise<any>{
  //   const user = req.user;
  //   console.log(user)
  //   console.log(pictureId)
  //   return this.userService.set(user, pictureId);
  // }

  // @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FileInterceptor('images', {
  //   storage: storageConfig('images'),
  //   fileFilter:(req, file, cb) =>{
  //     const ext =  extname(file.originalname);
  //     const allowedExtArr = ['.jpg', '.png', '.jpeg' , '.JPG', '.PNG'];
  //     i(!allowedExtArr.includes(ext)){
  //       req.fileValidationError = `Wrong extention type. Accepted file ext are: ${allowedExtArr.toString()}`;
  //       cb(null, false)
  //   }
  //       cb(null, true);
  //     // }
  //   }
  // }),
  // )f
  // @ApiOperation({ summary: 'Upload avatar for User' })
  // @Post('avatar/:id')
  // async set(
  //   @Req() req: any, 
  //   @Param('id', ParseIntPipe) pictureId: number,
  //   @UploadedFile() file: Express.Multer.File,
  // ): Promise<any>{
  //   const user = req.user;
  //   if (pictureId) {
  //     await this.userService.set(user, pictureId);
  //   }

  //   if (file) {
  //     const newAvatar = await this.mediaService.uploadImage(user, file);
  //     user.avatar = newAvatar;
  //     await this.userRepository.save(user);
  //   }
  // }
  @Patch('avatar')
  @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('images', {
    storage: storageConfig('images'),
    fileFilter:(req, file, cb) =>{
      const ext =  extname(file.originalname);
      const allowedExtArr = ['.jpg', '.png', '.jpeg' , '.JPG', '.PNG'];
      if(!allowedExtArr.includes(ext)){
        req.fileValidationError = `Wrong extention type. Accepted file ext are: ${allowedExtArr.toString()}`;
        cb(null, false)
    }
        cb(null, true);
      // }
    }
  }),
  )
  @ApiOperation({ summary: 'Upload avatar for User' })
  async updateAvatarWithMedia(
    @Req() req: RequestUser,
    @Query() image: UploadAvatar,
    @UploadedFile() file: Express.Multer.File,): Promise<UserEntity> {
      const user = req.user;
      if(image.pictureId){
        return this.userService.updateAvatar(user, image)
      }
      if(file){
        console.log(file)
        const newAvatar = await this.mediaService.uploadImage(user, file);
        user.avatarT = newAvatar.data;
        await this.userRepository.save(user);
        console.log(user)
      }
  }
} 
