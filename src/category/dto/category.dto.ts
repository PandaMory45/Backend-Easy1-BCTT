import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { BlogDto } from "src/blog/dto/blog.dto";


export class CreateCategoryDto
{
  // stt?: number;
  @ApiProperty({ example: 'sự kiện' })
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'sự kiện' })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'tinasoft' })
  @IsOptional()
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