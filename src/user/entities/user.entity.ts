import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { User, UserRole } from "../dto/user.dto";
import { BlogDto } from "src/blog/dto/blog.dto";
import { BlogEntryEntity } from "src/blog/entites/blog.entity";
import { ApiProperty } from "@nestjs/swagger";
import { MediaEntity } from "src/media/entities/media.entity";
import { Exclude } from "class-transformer";

@Entity()
export class UserEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()//////////
  name: string;

  @Column({unique: true})
  username: string;

  @ApiProperty()
  @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
  role: UserRole;

  @Column()////////////
  email: string;

  @Column({ select: false })
  @Exclude()////////exclude                             
  password: string

  @ApiProperty()
  @OneToMany(type => BlogEntryEntity, blogEntryEntity => blogEntryEntity.author)
  blogEntries: BlogEntryEntity[];
  
  @CreateDateColumn({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

  @UpdateDateColumn({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updatedAt: Date;  
  
  @Column({ type: 'varchar' , nullable: true})
  avatarT: string;

  @OneToOne(() => MediaEntity, media => media.user)
  avatar: MediaEntity;

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
