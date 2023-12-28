import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
@ApiTags('文件上传模块')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('avatar')
  @ApiOperation({ summary: '上传用户头像', description: '上传用户头像' })
  @UseInterceptors(FileInterceptor('avatar')) // FileInterceptor('字段名称') 上传单个文件
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `http://localhost:3000/uploadFiles/${file.filename}`,
      msg: '上传成功',
    };
  }
}
