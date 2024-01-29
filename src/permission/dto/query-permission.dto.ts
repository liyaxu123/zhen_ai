import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryPermissionDto {
  @Type(() => Number) // 用于在进行参数验证之前，将接收到的参数值进行转换
  @IsInt({ message: 'pageSize必须为int类型' })
  @IsNotEmpty()
  @ApiProperty({
    description: '每页条数',
    example: 10,
    required: true,
    type: 'number',
  })
  pageSize: number;

  @Type(() => Number)
  @IsInt({ message: 'pageNum必须为int类型' })
  @IsNotEmpty()
  @ApiProperty({
    description: '当前页码',
    example: 1,
    required: true,
    type: 'number',
  })
  pageNum: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'id',
    example: '',
    type: 'string',
    required: false,
  })
  id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: '权限code',
    example: '',
    type: 'string',
    required: false,
  })
  code?: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    description: '修改时间',
    type: 'object',
    required: false,
  })
  updateTime?: { startTime?: Date; endTime?: Date };
}
