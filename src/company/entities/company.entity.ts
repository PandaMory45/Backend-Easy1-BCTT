import { BlogEntryEntity } from "src/blog/entites/blog.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('company')
export class CompanyEntity{
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

  @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  updatedAt: Date;  

  @ManyToMany(() => BlogEntryEntity,{nullable: true, onDelete: 'SET NULL'})
  blogEntries: BlogEntryEntity[];
}