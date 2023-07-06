import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UserModule } from './user/user.module';
// import { AuthModule } from './auth/auth.module';
// import { BlogModule } from './blog/blog.module';
// // import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forRoot({
    type:'postgres',
    // host: process.env.DB_HOST,
    // port: parseInt(process.env.DB_PORT, 10),
    // username: process.env.DB_USERNAME,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_DATABASE,
    // autoLoadEntities: true,
    // synchronize: true
    host: 'localhost',
    port: 5434,
    username: 'postgres',
    password: '12345acb',
    database: 'easyoneDb',
    autoLoadEntities: true,
    synchronize: true
  }), 
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule, 
    AuthModule 
  ],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule {}
