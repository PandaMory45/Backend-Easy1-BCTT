import { BlogEntryEntity } from "src/blog/entites/blog.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MediaEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string

  @Column({ type: 'bytea' })
  data: string;

  @ManyToOne(() => UserEntity, user => user.media, {nullable: true, onDelete: 'SET NULL'})
  user: UserEntity;

  @ManyToMany(() => BlogEntryEntity, blogEntries => blogEntries.media, {nullable: true, onDelete: 'SET NULL'})
  blogEntries: BlogEntryEntity[];

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  createAt:Date;


}