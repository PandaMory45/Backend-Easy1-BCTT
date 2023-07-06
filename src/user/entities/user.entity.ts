import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { User, UserRole } from "../dto/user.dto";

@Entity()
export class UserEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique: true})
  username: string;

  @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
  role: UserRole

  @Column()
  email: string

  @Column()
  password: string

  @BeforeInsert()
  emaiToLowerCase(){
    this.email = this.email.toLowerCase()
  }

  // @BeforeInsert()
  // async hashPassword() {
  //   return (this.password = await bcrypt.hash(this.password, 10));
  
  // }
    
  // async comparePassword(password: string): Promise<boolean> {
  //   return await bcrypt.compare(password, this.password);
  // }
}
export class LoginAuthDto extends UserEntity{
  @Column()
  email: string

  @Column()
  password: string
}
export class ChangePasswordDto extends UserEntity{
  @Column()
  oldPassword: string
  
  @Column()
  newPassword: string

  @Column()
  recentPassword: string
}
export type RequestUser = Request & { user: User };