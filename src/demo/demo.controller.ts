import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DemoService } from './demo.service';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@Controller({
  path: 'demo',
  version: '1', // 版本号
})
@ApiTags('测试模块')
@ApiBearerAuth()
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Post()
  @ApiOperation({ summary: 'Post 创建数据' })
  create(@Body() createDemoDto: CreateDemoDto) {
    return this.demoService.create(createDemoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get 获取数据' })
  findAll() {
    return this.demoService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: '用户id',
    required: true,
    type: 'string',
  })
  @ApiOperation({ summary: '获取用户信息', description: '根据id获取用户信息' })
  findOne(@Param('id') id: string) {
    return this.demoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDemoDto: UpdateDemoDto) {
    return this.demoService.update(+id, updateDemoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.demoService.remove(+id);
  }
}
