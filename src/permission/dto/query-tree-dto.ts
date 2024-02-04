import {
  IsString,
  IsOptional,
  IsObject,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryTreeDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '菜单名称',
    required: false,
    type: 'string',
  })
  name?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: '显示状态',
    required: false,
    type: 'boolean',
  })
  isShow?: string;

  @IsOptional()
  @IsEnum({ 目录: 'M', 菜单: 'C', 按钮: 'F' })
  @ApiProperty({
    description: '菜单类型',
    type: 'enum',
    example: 'M',
    required: false,
  })
  menuType?: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    description: '创建时间',
    type: 'object',
    example: { startTime: '2022-01-01', endTime: '2022-12-31' },
    required: false,
  })
  createTime?: { startTime?: string; endTime?: string };
}
