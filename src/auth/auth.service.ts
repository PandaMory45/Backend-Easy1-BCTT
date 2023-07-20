import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/dto/user.dto';
import { LoginAuthDto, UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
const bcrypt = require('bcrypt')
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService

    ){}

  async hashPassword(password: string): Promise<string>{
    return await bcrypt.hash(password, 12)
  }

  async comparePassword(newPassword: string, passwordHash: string): Promise<boolean>{
    return await bcrypt.compare(newPassword, passwordHash);
  }

  //create User by Admin
  async createUser(user: User): Promise<object> {
    try {
      const newUser = new UserEntity();
      newUser.name = user.name;
      newUser.username = user.username;
      newUser.email = user.email;
      newUser.password = await this.hashPassword(user.password);
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

  async findUserByIdAndEmail(id: number, email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({where:{ id: id, email: email }});
  }

  async login(loginAuthDto: LoginAuthDto): Promise<object>{
    const { email, password } = loginAuthDto;
    const  user = await this.userRepository.findOne({where:{email: email}});
    if(!user){
      return {err: 'Email hoặc mật khẩu sai'}
    }
    //check password
    const matchPassword = await this.comparePassword(password, user.password)
    if(!matchPassword){
      return {err: 'Email hoặc mật khẩu sai'}
    }
    
    // console.log(this.test())
    //create token
    const jwt = await this.converToJwtString(user.id, user.email) 
    return {
      tokenType: 'Bearer',
      acces_token: jwt}
  }

  async converToJwtString(userId: number, email: string): Promise<string>{
    const payload = {
      sub: userId,
      email
    }
    return  this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get<string>('SECRET_KEY')
    })
  }
  async test(): Promise<void>{
    console.log(process.env.DB_HOST)
    console.log(parseInt(process.env.DB_PORT, 10))
    console.log(process.env.DB_USERNAME)
    console.log(process.env.DB_PASSWORD)
    console.log(process.env.DB_DATABASE)
  }
}
