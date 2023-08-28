import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ChangePasswordDto, FilterDto, QueryDto, RegisterUser, UploadAvatar, User, UserRole } from './dto/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { join } from 'path';
import { identity } from 'rxjs';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { MediaEntity } from 'src/media/entities/media.entity';


@Injectable()
export class UserService {
   constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MediaEntity)
    private readonly mediaRepo: Repository<MediaEntity>,
    private readonly authService: AuthService,
    
   ){}
  
   async registerUser(user: RegisterUser): Promise<User> {
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
    const user =  await this.userRepository.findOne({
      where:{id: id},
      relations: ['blogEntries', 'media', 'avatar']
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
  
    const queryBuilder = this.userRepository.createQueryBuilder('user');
  
    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', { username: `%${username}%` });
    }
  
    if (search) {
      queryBuilder.andWhere(
        '(user.username LIKE :search OR user.name LIKE :search)',
        { search: `%${search}%` },
      );
    }
  
    const users = await queryBuilder.getMany();
    return users;
  }

  async set(user: UserEntity, uplaodAva: UploadAvatar): Promise<UserEntity> {
    if (!user) {
      throw new BadRequestException('User not found');
    }
  
    const picture = await this.mediaRepo.findOne({ where: { id: uplaodAva.pictureId } });
  
    if (!picture) {
      throw new BadRequestException('Picture not found');
    }
  
    user.avatar = picture;
    
    const updatedUser = await this.userRepository.save(user); // Lưu user để cập nhật avatar
    
    return updatedUser;
  }

  async paginateFilterByUsername(options: IPaginationOptions, user: User): Promise<Pagination<User>> {
    const [users, totalUsers] = await this.userRepository.findAndCount({
        skip: Number(options.page) * Number(options.limit) || 0,
        take: Number(options.limit) || 10,
        order: { id: "ASC" },
        select: ['id', 'name', 'username', 'email', 'role'],
        where: [
            { username: Like(`%${user.username}%`) }
        ]
    });

    const usersPageable: Pagination<User> = {
        items: users,
        links: {
            first: options.route + `?limit=${options.limit}`,
            previous: options.route + ``,
            next: options.route + `?limit=${options.limit}&page=${Number(options.page) + 1}`,
            last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / Number(options.limit))}`
        },
        meta: {
            currentPage: Number(options.page),
            itemCount: users.length,
            itemsPerPage: Number(options.limit),
            totalItems: totalUsers,
            totalPages: Math.ceil(totalUsers / Number(options.limit))
        }
    };

    return usersPageable;
}

//Upload Avatar for User
async updateAvatar(user: UserEntity, imageId: UploadAvatar): Promise<UserEntity> {
  if (!user) {
    throw new BadRequestException('User not found');
  }
  const media =  await this.mediaRepo.findOne({
    where: {id: imageId.pictureId},
  })

  user.avatarT = media.data;
  return this.userRepository.save(user);
  }
}
