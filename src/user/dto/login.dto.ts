import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({ description: '用户名', example: 'admin', required: true })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ description: '密码', example: '123456', required: true })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ description: '验证码', example: '1234', required: true })
  code: string;
}
