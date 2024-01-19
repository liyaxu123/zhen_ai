import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { DemoModule } from './demo/demo.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Role } from './role/entities/role.entity';
import { Permission } from './permission/entities/permission.entity';
import { UploadModule } from './upload/upload.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb', // 指定数据库类型
      host: 'localhost', // 数据库地址
      database: 'demo', // 数据库名称
      entities: [User, Role, Permission],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: 'xxch',
      signOptions: { expiresIn: '24h' },
    }),
    DemoModule,
    UserModule,
    UploadModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
