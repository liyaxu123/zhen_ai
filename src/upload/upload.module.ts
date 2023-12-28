import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { join, extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.diskStorage({
        destination: join(__dirname, '../uploadFiles'), // 文件保存位置
        filename: (req, file, callback) => {
          // 文件新的名称
          const fileName = `${
            new Date().getTime() + extname(file.originalname)
          }`;
          return callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
