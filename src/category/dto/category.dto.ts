import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BlogDto } from "src/blog/dto/blog.dto";


export class CreateCategoryDto
{
  @ApiProperty({ example: 'sự kiện' })
  @IsNotEmpty()
  name?: string;

  @ApiProperty()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'sự kiện' })
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ example: 'tinasoft' })
  @IsNotEmpty()
  company?: string;

  @ApiProperty()
  @IsOptional()
  blogEntries?: BlogDto[];
}

export class UpdateCategoryDto{

  @ApiProperty({ example: 'sự kiện' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'sự kiện' })
  @IsOptional()
  description?: string

  @ApiProperty({ example: 'tinasoft' })
  @IsOptional()
  company?: string;

  @ApiProperty()
  @IsOptional()
  blogEntries?: BlogDto[];
}

export class FilterCatDto{
  @ApiProperty({ required: false, description: 'User for real-time category search' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ required: false, description: 'User for real-time company search' })
  @IsOptional()
  search?:string
}

export class QueryCatDto {
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
  name?: string;

  @ApiProperty({ required: false, description: 'Title to search'})
  @IsOptional()
  company?: string;

  @ApiProperty({ required: false, description: 'Date Create to search'})
  @IsOptional()
  createAt?: Date;
}