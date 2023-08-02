import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
// import { UploadInterceptor } from './upload.interceptor';
import { MediaService } from './media.service';
import { MediaDto } from './dto/media.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RequestUser } from 'src/user/dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/helpers/config';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('images', {storage: storageConfig('images')}))
  uploadFile(@Req() req: RequestUser, @UploadedFile() file: Express.Multer.File) {
    console.log(file)
  }
}
