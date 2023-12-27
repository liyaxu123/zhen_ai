import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { DemoModule } from './demo/demo.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb', // 指定数据库类型
      host: 'localhost', // 数据库地址
      database: 'demo', // 数据库名称
      entities: [User],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: 'xxch',
      signOptions: { expiresIn: '7d' },
    }),
    DemoModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
