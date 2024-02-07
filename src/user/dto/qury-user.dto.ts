import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  IsPhoneNumber,
  IsEmail,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryUserDto {
  @IsInt({ message: 'pageSize必须为int类型' })
  @IsNotEmpty()
  @ApiProperty({
    description: '每页条数',
    example: 10,
    required: true,
    type: 'number',
  })
  pageSize: number;

  @IsInt({ message: 'pageNum必须为int类型' })
  @IsNotEmpty()
  @ApiProperty({
    description: '当前页码',
    example: 1,
    required: true,
    type: 'number',
  })
  pageNum: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: '用户名',
    example: 'admin',
    type: 'string',
    required: false,
  })
  username?: string;

  @IsString()
  @IsOptional()
  @Length(1, 20, { message: '昵称长度为1-20' })
  @ApiProperty({
    description: '昵称',
    example: '张三',
    type: 'string',
    required: false,
  })
  nickname?: string;

  @IsString()
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  @ApiProperty({
    description: '邮箱',
    example: '123@163.com',
    type: 'string',
    required: false,
  })
  email?: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber('CN', { message: '手机号格式不正确' })
  @ApiProperty({
    description: '手机号码',
    example: '13700000000',
    type: 'string',
    required: false,
  })
  tel?: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    description: '创建时间',
    type: 'object',
    required: false,
  })
  createTime?: { startTime: string; endTime: string };
}
