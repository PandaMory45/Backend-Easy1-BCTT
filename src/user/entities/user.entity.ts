import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { User, UserRole } from "../dto/user.dto";
import { BlogDto } from "src/blog/dto/blog.dto";
import { BlogEntryEntity } from "src/blog/entites/blog.entity";
import { ApiProperty } from "@nestjs/swagger";
import { MediaEntity } from "src/media/entities/media.entity";

@Entity()
export class UserEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique: true})
  username: string;

  @ApiProperty()
  @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
  role: UserRole;

  @Column()
  email: string;

  @Column({ nullable: true, default: null })
  avatar: string;

  @Column({ select: false })
  password: string

  @ApiProperty()
  @OneToMany(type => BlogEntryEntity, blogEntryEntity => blogEntryEntity.author)
  blogEntries: BlogEntryEntity[];
  
  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updatedAt: Date;  
  
  @OneToMany(() => MediaEntity, media => media.user, {nullable: true, onDelete: 'SET NULL'})
  media: MediaEntity[];

  @BeforeInsert()
  emaiToLowerCase(){
    this.email = this.email.toLowerCase();
  }

  


  // @BeforeInsert()
  // async hashPassword() {
  //   return (this.password = await bcrypt.hash(this.password, 10));
  
  // }
    
  // async comparePassword(password: string): Promise<boolean> {
  //   return await bcrypt.compare(password, this.password);
  // }
}
