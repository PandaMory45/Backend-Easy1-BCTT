import { BlogEntryEntity } from "src/blog/entites/blog.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


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

  @CreateDateColumn({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

  @UpdateDateColumn({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updatedAt: Date; 

  @ManyToMany(type => BlogEntryEntity, blogEntryEntity => blogEntryEntity.category)
  blogEntries: BlogEntryEntity[]

}