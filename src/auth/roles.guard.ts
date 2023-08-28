import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "src/user/dto/user.dto";
import { UserService } from "src/user/user.service";


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    // console.log(user)
    const findUser = await this.userService.findOne(user.id);
    const hasPermission = this.matchRole(findUser, roles)

    delete(findUser.password)
    return findUser && hasPermission
  }
  async matchRole(user: User , roles: string[]): Promise<boolean>  {
    console.log(user)
    console.log(roles.includes(user.role))
    return roles.includes(user.role)
  }
}