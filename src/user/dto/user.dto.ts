import { Transform } from "class-transformer"
import { IsNotEmpty, MaxLength, MinLength } from "class-validator"

export class User {

  id?:  number
  @IsNotEmpty({ message: 'username không được để trống' })
  name: string

  @Transform(({ value }) => value && value.trim())
  @IsNotEmpty({ message: 'username không được để trống' })
  username?: string

  role: UserRole

  @IsNotEmpty({ message: 'email không được để trống' })
  @Transform(({ value }) => value && value.trim())
  @MinLength(1, { message: 'email không ít hơn 1 ký tự' })
  @MaxLength(30, { message: 'email không quá 30 ký tự' })
  email?: string

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
