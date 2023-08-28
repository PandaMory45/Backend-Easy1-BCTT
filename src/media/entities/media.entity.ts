import { BlogEntryEntity } from "src/blog/entites/blog.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MediaEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string

  @Column({ type: 'varchar' })
  data: string;

  @ManyToOne(() => UserEntity, user => user.media, {nullable: true, onDelete: 'SET NULL'})
  user: UserEntity;

  @ManyToMany(() => BlogEntryEntity, blogEntries => blogEntries.media, {nullable: true, onDelete: 'SET NULL'})
  blogEntries: BlogEntryEntity[];

  @CreateDateColumn({type: 'date', default: () => "CURRENT_DATE"})
  createAt: Date;

  @UpdateDateColumn({type: 'date', default: () => "CURRENT_DATE"})
  updateAt: Date;


}