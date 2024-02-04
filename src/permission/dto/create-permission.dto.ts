import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '父级ID',
    example: '1',
    required: true,
    type: 'string',
  })
  pid: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '目录/菜单/权限名称',
    example: '系统管理',
    required: true,
    type: 'string',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'icon图标',
    example: 'menu',
    required: false,
    type: 'string',
  })
  icon: string;

  @IsString()
  @ApiProperty({
    description: '权限标识',
    example: 'system:user:view',
    required: false,
    type: 'string',
  })
  perms: string;

  @IsString()
  @ApiProperty({
    description: '组件路径',
    example: '/system',
    required: false,
    type: 'string',
  })
  component: string;

  @IsEnum({ M: '目录', C: '菜单', F: '按钮' }, { message: '菜单类型错误' })
  @IsNotEmpty()
  @ApiProperty({
    description: '菜单类型',
    example: 'M',
    required: true,
    type: 'string',
  })
  menuType: 'M' | 'C' | 'F';

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: '显示排序',
    example: 0,
    required: true,
    type: 'number',
  })
  sort: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: '显示状态',
    example: true,
    required: true,
    type: 'boolean',
  })
  isShow: boolean;
}
