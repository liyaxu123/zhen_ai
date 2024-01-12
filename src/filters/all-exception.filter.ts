import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const request = ctx.getRequest<Request>(); // 获取 request 对象
    const response = ctx.getResponse<Response>(); // 获取 response 对象

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR; // 获取异常的状态码

    response.status(status).json({
      code: status,
      message: exception.message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
      success: false,
      tips: '自定义全局拦截的错误请求',
    });
  }
}
