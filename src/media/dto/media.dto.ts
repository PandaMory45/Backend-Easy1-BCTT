import { BlogEntryEntity } from "src/blog/entites/blog.entity";
import { User } from "src/user/dto/user.dto";
import { UserEntity } from "src/user/entities/user.entity";

export class MediaDto{
  id: number;

  filename: string;

  mimeType:  string

  data:string

  user: UserEntity;

  blogEntries: BlogEntryEntity[];

  createAt:Date;

}