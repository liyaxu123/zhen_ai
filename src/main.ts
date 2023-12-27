import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  // 开启版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 设置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('珍爱')
    .setDescription('珍爱项目接口文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // 使用 express-session 中间件
  app.use(
    session({
      secret: '76e9dfad-a7bf-4a36-85ea-ce2a5555d5c3', // 签名 加盐
      name: 'sid', // 生成客户端cookie 的名字 默认 connect.sid
      rolling: true, // 在每次请求时强行设置 cookie，这将重置 cookie 过期时间(默认:false)
      cookie: { maxAge: null }, // 设置返回到前端 key 的属性，默认值为{ path: ‘/’, httpOnly: true, secure: false, maxAge: null }。
    }),
  );

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/`);
}
bootstrap();
