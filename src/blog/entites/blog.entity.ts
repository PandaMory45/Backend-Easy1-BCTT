// import { ApiProperty } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { CategoryEntity} from "src/category/entities/category.entity";
import { CompanyEntity } from "src/company/entities/company.entity";
import { MediaEntity } from "src/media/entities/media.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { VoteEntity } from "src/votes/entities/votes.entity";
import { Entity, PrimaryGeneratedColumn, Column, BeforeUpdate, ManyToOne, ManyToMany, UpdateDateColumn, CreateDateColumn, OneToMany } from "typeorm";



@Entity('blog_entry')
export class BlogEntryEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({nullable: true})/////
    slug: string;

    @Column({default: ''})///////
    description: string;

    @Column({default: ''})///////
    body: string;

    @CreateDateColumn({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    updatedAt: Date;    

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date;
    }////////////

    @Column({default: 0})
    views: number;

    @Column({default: 0})
    upVote: number;

    @Column({default: 0})
    downVote: number;
    
    @ApiProperty()
    @OneToMany( () => VoteEntity, vote => vote.post)
    votes: VoteEntity[];

    @Column({nullable: true})
    headerImage: string;

    @Column({nullable: true})///////
    publishedDate: Date;

    @Column({nullable: true})///////
    isPublished: boolean;
     
    @ApiProperty()
    @ManyToOne(type => UserEntity, user => user.blogEntries)
    author: UserEntity;

    @ApiProperty()
    @ManyToMany(type => CategoryEntity, category => category.blogEntries)
    category: CategoryEntity

    @ApiProperty()
    @ManyToMany(() => CompanyEntity, company => company.blogEntries, {nullable: true, onDelete: 'SET NULL'})
    company: CompanyEntity[];

    @ManyToMany(() => MediaEntity, media => media.blogEntries, {nullable: true, onDelete: 'SET NULL'})
    media: MediaEntity[]
}

