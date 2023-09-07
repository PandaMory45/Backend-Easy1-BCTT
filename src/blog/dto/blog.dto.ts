import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
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
  author?: User;

  @ApiProperty()
  @IsOptional()
  category?: CreateCategoryDto;
  
  @ApiProperty()
  @IsOptional()
  headerImage?: string;
}
export class UpdatePost{
  @ApiProperty({ example: 'Khai trương' })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Khai trương' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 'Khai trương' })
  @IsOptional()
  @IsString()
  body: string;
}

export class FilterBlogDto{
  @ApiProperty({required: false})
  @IsOptional()
  title?: string;

  @ApiProperty({required: false})
  @IsOptional()
  search?: string

  @ApiProperty({required: false})
  @IsDateString()
  createAt?: string;
}

export class getBlogDto{
  @ApiProperty({ example: 'Khai trương' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Khai trương hồng phát' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

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
  createAt?: Date;

  @ApiProperty()
  @IsOptional()
  category?: CreateCategoryDto;
  
  @ApiProperty()
  @IsOptional()
  headerImage?: string;
}

export class QueryPostDto{
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

  @ApiProperty({ required: false, description: 'Date Create to search'})
  @IsOptional()
  createAt?: Date;
}