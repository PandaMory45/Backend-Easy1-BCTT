import { BlogEntryEntity } from "src/blog/entites/blog.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class CategoryEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string

  @Column()
  description: string;

  @Column()
  company: string;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updatedAt: Date; 

  @OneToMany(type => BlogEntryEntity, blogEntryEntity => blogEntryEntity.category, {nullable: true, onDelete: 'SET NULL'})
  blogEntries: BlogEntryEntity[]

}