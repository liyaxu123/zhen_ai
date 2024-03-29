import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';
import { QueryTreeDto } from './dto/query-tree-dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QueryValidationPipe } from '../pipes/query-validation.pipe';
import { LoginGuard } from '../guards/login.guard';

@ApiTags('权限字段管理模块')
@Controller('permission')
@UseGuards(LoginGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: '创建权限' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: '权限字典分页查询' })
  findAll(@Query(QueryValidationPipe) queryInfo: QueryPermissionDto) {
    return this.permissionService.findAll(queryInfo);
  }

  @Post('/tree')
  @ApiOperation({ summary: '获取菜单权限树' })
  getTree(@Body(ValidationPipe) queryInfo: QueryTreeDto) {
    return this.permissionService.getTree(queryInfo);
  }

  @Patch(':id')
  @ApiOperation({ summary: '根据ID更新权限字段' })
  update(
    @Param('id', ValidationPipe) id: string,
    @Body(ValidationPipe) updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '根据ID删除权限字段' })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}
