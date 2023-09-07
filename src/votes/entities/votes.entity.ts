import { BlogEntryEntity } from "src/blog/entites/blog.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VoteEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, user => user.votes, {nullable: true, onDelete: 'SET NULL'})
  user: UserEntity;

  @ManyToOne(() => BlogEntryEntity, post => post.votes, {nullable: true, onDelete: 'SET NULL'})
  post: BlogEntryEntity;

  @Column()
  typeVote: VoteType;
}

export enum VoteType{
  Upvote = 'upvote',
  Downvote = 'downvote'
}