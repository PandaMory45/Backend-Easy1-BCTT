import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MediaEntity } from './entities/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMediaDto } from './dto/media.dto';
import { User } from 'src/user/dto/user.dto';
import { createReadStream } from 'fs';
import * as fs from 'fs/promises';
import { UserEntity } from 'src/user/entities/user.entity';
import { QueryOptions } from 'src/helpers/query-options.config';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
// export const MEDIA_URL = `http://localhost:3000/media/upload/${file.filename}`
@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
  ) {}

  async uploadImage(user: UserEntity,file: Express.Multer.File): Promise<MediaEntity> {
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!file) {
      throw new BadGatewayException('File is not an image');
    }
    
    // const fileUploadDto: CreateMediaDto = {}

    const media = new MediaEntity();
    media.title = file.filename;
    // media.data = await this.convertFileToBuffer(file.path);
    media.data = `http://localhost:3000/media/upload/${file.filename}`;
    media.user = user;
    
    return this.mediaRepository.save(media);
  }

  async deleteOne(id: number): Promise<any>{
    return this.mediaRepository.delete(id);
  }
  
//   private async convertFileToBuffer(filePath: string): Promise<Buffer> {
//     try {
//       const fileData = await fs.readFile(filePath);
//       return fileData;
//     } catch (error) {
//       throw new Error(`Error reading file: ${error.message}`);
//     }
// }
async paginate(options: IPaginationOptions): Promise<Pagination<MediaEntity>> {
  const queryBuilder = this.mediaRepository.createQueryBuilder('media');
  return paginate<MediaEntity>(queryBuilder, options);
}

async paginateFilterByTitle(options: IPaginationOptions, title: string): Promise<Pagination<MediaEntity>> {
  const queryBuilder = this.mediaRepository.createQueryBuilder('media');
  queryBuilder.where(`media.title LIKE :title`, { title: `%${title}%` });
  return paginate<MediaEntity>(queryBuilder, options);
}
}
