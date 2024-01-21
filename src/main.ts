import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpReqTransformInterceptor } from './interceptors/http-req.interceptor';
import { AllExceptionFilter } from './filters/all-exception.filter';
import * as session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn'],
  });

  /**
   * 启用CORS，解决跨域问题
   *
   * 问题一：处理文件上传时，前端报错跨域问题
   *        在进行文件上传时，浏览器发起了一个预检请求（preflight request），而服务器的响应中没有包含允许使用 x-requested-with 头部的信息。解决这个问题的方法是在 CORS 配置中添加了 OPTIONS 方法到允许的方法列表，以及在 allowedHeaders 中添加了 x-requested-with。这应该允许浏览器进行预检请求时包含 x-requested-with 头部，从而解决跨域问题
   *
   * 问题二：配置CORS后，服务器无法获取前端请求携带的cookies
   *        主要是因为浏览器的安全策略和CORS的限制。当你在NestJS应用程序中启用CORS时，浏览器可能会限制跨域请求中的一些敏感头部信息，其中包括“Cookie”头部，这可能影响会话管理。
   *        在处理请求时，确保在响应头中包含Access-Control-Allow-Credentials: true，这是告诉浏览器允许携带凭证的关键。如何设置？在CORS配置中将 credentials 选项设置为true，以允许浏览器在跨域请求中包含凭证信息（例如，Cookie）
   * 同时在前端发起请求时，确保在fetch或XMLHttpRequest等方法中设置了credentials: 'include'。
   * 在前端使用 Axios 发送跨域请求时，你需要确保 Axios 的请求配置中包含 withCredentials: true 选项，以便携带凭证（例如，Cookie）。
   *        还需要注意的是，你需要将后端的CORS配置更改为指定允许的来源，而不是使用通配符。这是因为前端在使用 withCredentials: true 时，浏览器要求服务器在返回的 Access-Control-Allow-Origin 头部中指定明确的来源，而不能是通配符 *。
   */
  app.enableCors({
    origin: 'http://localhost:8000', // 指定允许的来源
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
    credentials: true, // 允许浏览器在跨域请求中包含凭证信息(cookies)，配置此项时，必须指定允许的来源，而不是使用通配符，否则不生效
  });

  // 配置全局路由前缀
  app.setGlobalPrefix('api');

  /* 
    配置静态资源服务器
    访问资源路径示例：http://localhost:3000/uploadFiles/1703775003336.jpeg
  */
  app.useStaticAssets(join(__dirname, 'uploadFiles'), {
    prefix: '/uploadFiles',
  });

  // 开启版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 使用 express-session 中间件
  app.use(
    session({
      secret: '76e9dfad-a7bf-4a36-85ea-ce2a5555d5c3', // 签名 加盐
      name: 'sid', // 生成客户端cookie 的名字 默认 connect.sid
      rolling: true, // 在每次请求时强行设置 cookie，这将重置 cookie 过期时间(默认:false)
      cookie: { maxAge: null }, // 设置返回到前端 key 的属性，默认值为{ path: ‘/’, httpOnly: true, secure: false, maxAge: null }。
    }),
  );

  // 全局响应拦截器，统一响应数据格式
  app.useGlobalInterceptors(new HttpReqTransformInterceptor());
  // 全局异常过滤器，统一错误信息
  app.useGlobalFilters(new AllExceptionFilter());

  // 设置Swagger文档
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('珍爱')
    .setDescription('珍爱项目接口文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000/`);
}
bootstrap();
