import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { BlogEntryEntity } from "src/blog/entites/blog.entity";
import { User } from "src/user/dto/user.dto";
import { UserEntity } from "src/user/entities/user.entity";

export class CreateMediaDto{
  // id?: number

  // @ApiProperty({ required: false, description: 'Title to search', example: 'Sample Title' })
  // @IsOptional()
  // title?: string;

  // data?: string;

  // user?: User;

  // blogEntries?: BlogEntryEntity[];
}
export class upDateDto{
  title?: string;
  
}
export class MediaQueryDto {
  @ApiProperty({ required: false, description: 'Page number', example: 1 })
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiProperty({ required: false, description: 'Number of items per page', example: 10 })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false, description: 'Title to search'})
  @IsOptional()
  title?: string;
}