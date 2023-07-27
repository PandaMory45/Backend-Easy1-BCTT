// import { ApiProperty } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { CategoryEntity} from "src/category/entities/category.entity";
import { CompanyEntity } from "src/company/entities/company.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, ManyToOne, ManyToMany } from "typeorm";



@Entity('blog_entry')
export class BlogEntryEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({nullable: true})
    slug: string;

    @Column({default: ''})
    description: string;

    @Column({default: ''})
    body: string;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    updatedAt: Date;    

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date;
    }
    @Column({default: 0})
    views: number;

    @Column({default: 0})
    upVote: number;

    @Column({default: 0})
    downvote: number;
 
    @Column({nullable: true})
    headerImage: string;

    @Column({nullable: true})
    publishedDate: Date;

    @Column({nullable: true})
    isPublished: boolean;

    @ApiProperty()
    @ManyToOne(type => UserEntity, user => user.blogEntries)
    author: UserEntity;

    @ApiProperty()
    @ManyToOne(type => CategoryEntity, category => category.blogEntries, {nullable: true, onDelete: 'SET NULL'})
    category: CategoryEntity

    @ApiProperty()
    @ManyToMany(() => CompanyEntity, company => company.blogEntries, {nullable: true, onDelete: 'SET NULL'})
    company: CompanyEntity[];
}