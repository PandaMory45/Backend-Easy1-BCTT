import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangePasswordDto, FilterDto, QueryDto, User, UserRole } from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { join } from 'path';


@Injectable()
export class UserService {
   constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
   ){}
  

  async findOne(id: number): Promise<User> {
    const user =  await this.userRepository.findOne({
      where:{id: id},
      relations: ['blogEntries']
    })
    const {password, ...result} = user
    return result;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find()
    users.forEach(function (v) {delete v.password})
    return users
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
  
  // async getUsers(filterDto: FilterDto): Promise<User[]> {
  //   const { username, search } = filterDto;

  //   let users = await this.userRepository.find();

  //   if (username) {
  //     users = users.filter((user) => user.username === username);
  //   }

  //   if (search) {
  //     users = users.filter(
  //       (user) =>
  //         user.username.includes(search) || user.name.includes(search),
  //     );
  //   }

  //   return users;
  // }

  async getUsers(filterDto: FilterDto): Promise<User[]> {
    const { username, search } = filterDto;
  
    // Create a query builder for the User entity
    const queryBuilder = this.userRepository.createQueryBuilder('user');
  
    // If username is provided, perform a partial search
    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', { username: `%${username}%` });
    }
  
    // If search is provided, perform a partial search on multiple columns (e.g., username, name)
    if (search) {
      queryBuilder.andWhere(
        '(user.username LIKE :search OR user.name LIKE :search)',
        { search: `%${search}%` },
      );
    }
  
  // Execute the query and return the results
    const users = await queryBuilder.getMany();
    return users;
  }

}
