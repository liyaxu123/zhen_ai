import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Inject,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import * as svgCaptcha from 'svg-captcha';
import { Response } from 'express';

@Controller({
  path: 'user',
  version: '1',
})
@ApiTags('用户模块')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 注入 JwtService
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Post('/register')
  @ApiOperation({ summary: '用户注册' })
  async register(@Body(ValidationPipe) user: RegisterDto) {
    console.log('register', user);
    return await this.userService.register(user);
  }

  @Post('/login')
  @ApiOperation({ summary: '用户登录' })
  async login(
    @Body(ValidationPipe) user: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<string> {
    const foundUser = await this.userService.login(user);

    if (foundUser) {
      // 生成 token
      const token = await this.jwtService.signAsync({
        user: {
          id: foundUser.id,
          username: foundUser.username,
        },
      });
      // 把 user 信息放到 jwt 通过 header 里返回
      res.setHeader('token', token);
      return 'login success';
    } else {
      return 'login fail';
    }
  }

  @Post('/logout')
  @ApiOperation({ summary: '退出登录' })
  logout(@Body() createUserDto: any) {
    console.log(createUserDto);
    // return this.userService.create(createUserDto);
  }

  @Get('code')
  @ApiOperation({ summary: '获取验证码图片', description: '获取验证码图片' })
  createCode(@Req() req, @Res() res) {
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#cc9966', //背景颜色
      ignoreChars: '0o1i', // 验证码字符中排除 0o1i
      noise: 4, // 干扰线条的数量
    });
    req.session.code = captcha.text; //存储验证码记录到session
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户信息', description: '根据id获取用户信息' })
  @ApiParam({
    name: 'id',
    description: '用户id',
    required: true,
    type: 'string',
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新用户信息', description: '根据id更新用户信息' })
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '注销用户信息', description: '根据id注销用户信息' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}