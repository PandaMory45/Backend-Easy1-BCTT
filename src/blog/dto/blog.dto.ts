import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateCategoryDto } from "src/category/dto/category.dto";
import { User } from "src/user/dto/user.dto";

export class BlogDto{
  @ApiProperty({ example: 'Khai trương' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;
  
  @ApiProperty({ example: 'khai-truong' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  slug?: string;

  @ApiProperty({ example: 'Khai trương hồng phát' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Khai trương hồng phát'  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  body?: string;

  @ApiProperty()
  @IsOptional()
  views?: number;

  @ApiProperty()
  @IsOptional()
  upVote?: number;

  @ApiProperty()
  @IsOptional()
  downVote?:number;

  @ApiProperty()
  @IsOptional()
  author?: User;
  
  @ApiProperty()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty()
  @IsOptional()
  category?: CreateCategoryDto;
  
  @ApiProperty()
  @IsOptional()
  headerImage?: string;
}