import { Transform } from "class-transformer"
import { IsNotEmpty, MaxLength, MinLength } from "class-validator"
import { BlogDto } from "src/blog/dto/blog.dto"

export class User {

  id:  number
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  username: string

  role: UserRole

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  email: string

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  password: string

  blogEntries: BlogDto[];
}

export enum UserRole{
  ADMIN = '1',
  DEGINER = '2',
  USERPLUS = '3',
  USER = '4',
}
