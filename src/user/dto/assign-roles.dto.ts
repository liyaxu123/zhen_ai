import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRolesDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '用户ID', example: '1', required: true })
  userId: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: '角色ID列表',
    example: ['1'],
    required: true,
  })
  roleIds: string[];
}
