import { Injectable, NotFoundException } from '@nestjs/common';
import { MediaEntity } from './entities/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaDto } from './dto/media.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
  ) {}

  // async uploadFile(file: Express.Multer.File, mediaDto: MediaDto, userId: number): Promise<MediaEntity> {
  //   // Lưu thông tin tệp tin vào cơ sở dữ liệu
  //   const media: MediaEntity = {
  //     filename: file.filename,
  //     mimeType: file.mimetype,
  //     data: file.buffer.toString('base64'),
  //     ...mediaDto,
  //   };
  //   console.log(media)
  //   const savedMedia = await this.mediaRepository.save(media);
  //   return savedMedia;
  }
// }
//   async setAvatar(mediaDto: MediaDto, userId: number): Promise<void> {
//     const user = await this.usersRepository.findOne(userId);
//     const avatar = await this.mediaRepository.findOne(mediaDto.avatarId);

//     if (avatar) {
//       user.avatar = avatar;
//       await this.usersRepository.save(user);
//     } else {
//       throw new NotFoundException('Avatar not found');
//     }
//   }

//   // Các phương thức khác không thay đổi
// }
