import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '角色名称',
    example: 'admin',
    required: true,
    type: 'string',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: '角色描述',
    example: '超级管理员',
    type: 'string',
  })
  desc: string;

  @IsBoolean({
    message: '状态必须为布尔值',
  })
  @ApiProperty({
    description: '状态',
    example: true,
    type: 'boolean',
  })
  status: boolean;

  @ApiProperty({
    description: '权限集合',
    example: ['article_create'],
  })
  permissionIds: string[];
}
