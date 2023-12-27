import { Controller, Get, UseGuards } from '@nestjs/common';
import { LoginGuard } from './login.guard';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  @UseGuards(LoginGuard) // 登录守卫
  aaa() {
    return 'aaa';
  }

  @Get('bbb')
  @UseGuards(LoginGuard)
  bbb() {
    return 'bbb';
  }
}
