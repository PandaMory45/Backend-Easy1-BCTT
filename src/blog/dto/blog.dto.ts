import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/user/dto/user.dto";

export class BlogDto{
  
  id?: number;

  @IsNotEmpty({ message: 'Password không để trống!' })
  @IsString()
  title?: string;
  
  @IsString()
  slug?: string;

  @IsNotEmpty({ message: 'Password không để trống!' })
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'Password không để trống!' })
  @IsString()
  body?: string;
  createAt?: Date;
  updateAt?: Date;
  likes?: number;
  author?: User;
  headerImage?: string;
  publishedDate?: Date;
  isPublished?: boolean;
}