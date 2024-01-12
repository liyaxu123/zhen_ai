import { Controller, Get, UseGuards } from '@nestjs/common';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/auth.guard';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from './decorators/roles.decorator';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  @ApiOperation({ summary: '测试权限' })
  @ApiBearerAuth()
  @UseGuards(LoginGuard) // 登录守卫
  @UseGuards(AuthGuard) // 权限认证
  @Roles('admin', 'tester') // 声明该路由只有 admin 和 tester 角色可以访问
  aaa() {
    return 'aaa';
  }

  @Get('bbb')
  @ApiOperation({ summary: '测试登录' })
  @ApiBearerAuth()
  @UseGuards(LoginGuard)
  bbb() {
    return 'bbb';
  }
}
