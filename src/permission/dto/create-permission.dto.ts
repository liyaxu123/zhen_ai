import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '权限code',
    example: 'article_create',
    required: true,
    type: 'string',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '权限描述',
    example: '拥有创建文章的权限',
    required: true,
    type: 'string',
  })
  desc: string;
}
