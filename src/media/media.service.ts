import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MediaEntity } from './entities/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateMediaDto, UpdatePictureDto } from './dto/media.dto';
import { User } from 'src/user/dto/user.dto';
import { createReadStream } from 'fs';
import * as fs from 'fs/promises';
import { UserEntity } from 'src/user/entities/user.entity';
// import { QueryOptions } from 'src/helpers/query-options.config';
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
    const media = new MediaEntity();
    media.title = file.filename;
    media.data = `http://localhost:3000/media/upload/${file.filename}`;
    media.user = user;
    
    return this.mediaRepository.save(media);
  }

  // async setImage(user: UserEntity, imageId: number): Promise<any>{
  //   user.avatar = 
  // }

  async showOne(id: number): Promise<MediaEntity>{
    return this.mediaRepository.findOne({
      where: {id: id},
      relations: ['user']
    })
  }

  //Delete Multiple
  async deleteMutiple(ids: string[]):Promise<DeleteResult>{
    return await this.mediaRepository.delete({id: In(ids)});
  }

  //Delete Sigle
  async deleteOne(id: number): Promise<any>{
    return this.mediaRepository.delete(id);
  }

  //Lấy tất cả hình ảnh
  async paginate(options: IPaginationOptions): Promise<Pagination<MediaEntity>> {
    const queryBuilder = this.mediaRepository.createQueryBuilder('media');
    return paginate<MediaEntity>(queryBuilder, options);
  }

  //Lấy những hình ảnh có các kí tự giống ở phần "title" giống với Input
  async paginateFilterByTitle(options: IPaginationOptions, title: string): Promise<Pagination<MediaEntity>> {
    const queryBuilder = this.mediaRepository.createQueryBuilder('media');
    queryBuilder.where(`media.title LIKE :title`, { title: `%${title}%` });
    return paginate<MediaEntity>(queryBuilder, options);
  }
  
  //Lấy những hình ảnh được tạo vào móco thời gian được chỉ định
  async paginateFilterByDate(options: IPaginationOptions, createAt: Date):Promise<Pagination<MediaEntity>>{
    const queryBuilder = this.mediaRepository.createQueryBuilder('media');
    queryBuilder.where(`media.createAt >= :createAt`, { createAt });
    return paginate<MediaEntity>(queryBuilder, options);
  }

  async updateOne(id: number ,updatePicture: UpdatePictureDto): Promise<MediaEntity>{
    const picture = await this.showOne(id);
    if(!picture){
      throw 'Pictrue Not found';
    }
    await this.mediaRepository.update(id, updatePicture);
    return this.showOne(id);
  }
}
