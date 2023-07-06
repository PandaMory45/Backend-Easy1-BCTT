import { Injectable } from '@nestjs/common';
import { ChangePasswordDto, UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { error } from 'console';

@Injectable()
export class UserService {
   constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
   ){}
  //register account by User
  async register(user: User): Promise<User> {
    try {
      user.role = UserRole.USER;
      const newUser = new UserEntity();
      newUser.name = user.name;
      newUser.username = user.username;
      newUser.email = user.email;
      newUser.password = await this.authService.hashPassword(user.password);
      newUser.role = user.role
      // console.log(newUser.password)
      const savedUser = await this.userRepository.save(newUser);
      delete(savedUser.password)
      // return await this.converToJwtString(user.id, user.email);
      return savedUser
    } catch(err) {
      throw err
    }
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({where:{id: id}})
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find()
  }

  async deletOne(id: number): Promise<any> {
    return await this.userRepository.delete(id)
  }

  async updateOne(id: number, user: User): Promise<any> { 
    delete(user.email)
    delete(user.password)
    return await this.userRepository.update(id, user)
  }
  
  async ChangePassword(user: User, ChangePassword: ChangePasswordDto): Promise<any>{
    const {oldPassword, newPassword, recentPassword} = ChangePassword;
    const isMatchOldPasword = await this.authService.comparePassword(oldPassword, user.password)
    if(!isMatchOldPasword || oldPassword === newPassword){
      throw 'Nhập sai mật khẩu'
    }

    if (newPassword != recentPassword){
      throw 'Mật khẩu không khớp'
    }

    const hashNew = await this.authService.hashPassword(newPassword)
    user.password = hashNew;
    await this.userRepository.save(user)
    return 'Đổi mật khẩu thành công'
  }
}
