import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoginGuard } from '../login.guard';

@Controller('upload')
@ApiTags('文件上传模块')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('avatar')
  @ApiOperation({ summary: '上传用户头像', description: '上传用户头像' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传用户头像',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(LoginGuard) // 验证用户是否登录
  @UseInterceptors(FileInterceptor('avatar')) // FileInterceptor('字段名称') 上传单个文件
  uploadAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpg|jpeg|png/, // 验证文件类型为：jpg、jpeg、png格式
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 10, // 文件大小不能超过 10Mb
        })
        .build({
          fileIsRequired: true, // 文件必传
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return {
      url: `http://localhost:3000/uploadFiles/${file.filename}`,
      msg: '上传成功',
    };
  }
}
