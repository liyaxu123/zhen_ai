import { IsNotEmpty, IsInt, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryRoleDto {
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
    description: '角色名称',
    example: '',
    type: 'string',
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsString({
    message: 'status必须为boolean类型',
  })
  @ApiProperty({
    description: '状态',
    example: 'true',
    type: 'string',
    required: false,
  })
  status?: string;
}
