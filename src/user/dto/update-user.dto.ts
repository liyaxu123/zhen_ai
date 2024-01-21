import {
  IsNotEmpty,
  IsString,
  Length,
  IsUrl,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 20, { message: '昵称长度为1-20' })
  @ApiProperty({
    description: '昵称',
    type: 'string',
  })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: '邮箱格式不正确' })
  @ApiProperty({
    description: '邮箱',
    example: '123@163.com',
    type: 'string',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('CN', { message: '手机号格式不正确' })
  @Length(11, 11, {
    message: '手机号长度为11位',
  })
  @ApiProperty({
    description: '手机号码',
    example: '13700000000',
    type: 'string',
  })
  tel: string;

  @IsString()
  @Length(0, 200, {
    message: '个人简介长度为0~200字符',
  })
  @ApiProperty({
    description: '个人简介',
    type: 'string',
  })
  intro: string;

  @IsString()
  @IsUrl({}, { message: '头像地址必须是一个有效的URL' })
  @ApiProperty({
    description: '头像地址',
    example: 'http://example.com/avatar.png',
    type: 'string',
  })
  avatar: string;
}
