import { BadRequestException, Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import path = require('path');
// import { UploadInterceptor } from './upload.interceptor';
import { MediaService } from './media.service';
import { CreateMediaDto, MediaQueryDto, UpdatePictureDto } from './dto/media.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { QueryDto, RequestUser } from 'src/user/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/helpers/config';
import {Response, query} from 'express';
import {Request} from 'express';
import {extname}  from 'path';
import { Pagination } from 'nestjs-typeorm-paginate';
import { MediaEntity } from './entities/media.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
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
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req : any ){
    // console.log(req.user)
    // console.log(file);
    if(req.fileValidationError){
      throw new BadRequestException(req.fileValidationError)
    }
    return this.mediaService.uploadImage(req.user, file);  
  }

  @Get('upload/:filename')
  async getPicture(@Param('filename') __filename, @Res() res: Response):Promise<void>{
    res.sendFile(__filename, {root:  './uploads/images'})
  }

  @Delete(':id')
  deleteImage(@Param('id') id: number): Promise<any>{
    return this.mediaService.deleteOne(id)
  }

  @Delete(':id/multiple')
  deleteMutiple(@Query('ids', new ParseArrayPipe({items: String, separator: ','})) ids: string[]): Promise<any>{
    return this.mediaService.deleteMutiple(ids)
  }

  @Get()
  async index(@Query() queryDto: MediaQueryDto): Promise<Pagination<MediaEntity>> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;

    if (queryDto.title) {
      return await this.mediaService.paginateFilterByTitle(
        {
          page,
          limit,
          route: 'http://localhost:3000/media',
        },
        queryDto.title,
      );
    } 
    if(queryDto.createAt)
    {
      return await this.mediaService.paginateFilterByDate(
        {
        page,
        limit,
        route: 'http://localhost:3000/media',
      },
      queryDto.createAt,
      );
    }
    else{
      return await this.mediaService.paginate(
        {
        page,
        limit,
        route: 'http://localhost:3000/media',
      })
    }
  }

  @Put('/:id')
  async updateOne(@Param('id') id: number, @Body() updatePicture: UpdatePictureDto): Promise<MediaEntity>{
    return this.mediaService.updateOne(Number(id), updatePicture);
  }
}
