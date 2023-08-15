import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { BlogDto } from "src/blog/dto/blog.dto"
import { MediaEntity } from "src/media/entities/media.entity"
import { Column } from "typeorm"
import { UserEntity } from "../entities/user.entity"

export class User {
  @ApiProperty()
  id:  number

  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  username: string

  @ApiProperty()
  role: UserRole
  
  @ApiProperty({ example: 'superadmin@gmail.com' })
  @IsNotEmpty({ message: 'email không được để trống' })
  @MinLength(1, { message: 'email không ít hơn 1 ký tự' })
  @MaxLength(30, { message: 'email không quá 30 ký tự' })
  email: string

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'USER011101' })
  @MinLength(5, { message: 'password không ít hơn 5 ký tự' })
  @MaxLength(30, { message: 'password không quá 30 ký tự' })
  password?: string

  @ApiProperty()
  blogEntries: BlogDto[];

  // media?: MediaEntity;
}

export class RegisterUser {

  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  username: string

  @ApiProperty()
  role: UserRole
  
  @ApiProperty({ example: 'superadmin@gmail.com' })
  @IsNotEmpty({ message: 'email không được để trống' })
  @MinLength(1, { message: 'email không ít hơn 1 ký tự' })
  @MaxLength(30, { message: 'email không quá 30 ký tự' })
  email: string

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'USER011101' })
  @MinLength(5, { message: 'password không ít hơn 5 ký tự' })
  @MaxLength(30, { message: 'password không quá 30 ký tự' })
  password?: string

}

export enum UserRole{
  ADMIN = '1',
  DEGINER = '2',
  USERPLUS = '3',
  USER = '4',
}
export class LoginAuthDto{
  @ApiProperty({ example: 'superadmin@gmail.com' })
  @IsNotEmpty({ message: 'email không được để trống' })
  @MinLength(1, { message: 'email không ít hơn 1 ký tự' })
  @MaxLength(30, { message: 'email không quá 30 ký tự' })
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'USER011101' })
  @MinLength(5, { message: 'password không ít hơn 5 ký tự' })
  @MaxLength(30, { message: 'password không quá 30 ký tự' })
  password: string;
}
export class ChangePasswordDto {
  @ApiProperty({ example: '12345678' })
  @IsNotEmpty({ message: 'USER011101' })
  @MinLength(5, { message: 'password không ít hơn 5 ký tự' })
  @MaxLength(30, { message: 'password không quá 30 ký tự' })
  oldPassword: string
  
  @ApiProperty({ example: '123456789' })
  @IsNotEmpty({ message: 'USER011101' })
  @MinLength(5, { message: 'password không ít hơn 5 ký tự' })
  @MaxLength(30, { message: 'password không quá 30 ký tự' })
  newPassword: string

  @ApiProperty({ example: '123456789' })
  @IsNotEmpty({ message: 'USER011101' })
  @MinLength(5, { message: 'password không ít hơn 5 ký tự' })
  @MaxLength(30, { message: 'password không quá 30 ký tự' })
  recentPassword: string
}

export class QueryDto {

  @ApiProperty({ required: false, name: 'searchFields[]' })
  @IsOptional()
  @IsArray()
  @IsIn(['username', 'email', 'company', 'category'], { each: true })
  @IsString({ each: true })
  searchFields?: string[] = ['username', 'email', 'company', 'category'];
}
export class SearchDto {
  @IsNotEmpty()
  @IsString()
  keyword: string;
}

export class FilterDto {
  @ApiProperty({required: false , description: 'Username for real-time user search' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({required: false})
  @IsString()
  @IsOptional()
  search?: string;
}
export type RequestUser = Request & { user: UserEntity };

export class UploadAvatar{

}