import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { User } from "src/user/dto/user.dto";
import { UserService } from "src/user/user.service";
import { BlogService } from "../blog.service";


@Injectable()
export class UserIsAuthor implements CanActivate {
  constructor(
    private blogService: BlogService,
    private userService: UserService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const request = context.switchToHttp().getRequest();
    
    const params = request.params;

    const blogEntryId: number = Number(params.id)

    const user: User = request.user;

    try{
      const userEntity = await this.userService.findOne(user.id);
      const blogEntity = await this.blogService.findOne(blogEntryId)
      console.log(blogEntity)
      let hasPermission = false;

       if(userEntity.id === blogEntity.author.id){
        hasPermission = true
       }

       return user && hasPermission
    }catch (error){
      return false;
    }
  }  
}