import { Controller, Get, Post, UseInterceptors, UploadedFile, UploadedFiles, UseGuards } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import * as fs from 'fs';
import * as path from 'path';
import { Result } from '../../common/interfaces/result.interface';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../core/guards/roles.guard';

@Controller('/api/upload')
@UseGuards(AuthGuard(), RolesGuard)
export class UploadController {
  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async single(@UploadedFile() file): Promise<Result> {
    return {code: 200, message: '上传成功', data: {
      fieldname: file.fieldname,
      mimetype: file.mimetype,
      size: file.size,
      filename: file.filename,
      originalname: file.originalname,
      path: file.path.substr(6),
    }};
  }

  @Post('multi')
  @UseInterceptors(FilesInterceptor('files'))
  multi(@UploadedFiles() files) {
    console.log(files);
  }

  // 创建文件夹
  mkdirs(dirpath) {
    if (!fs.existsSync(path.dirname(dirpath))) {
      this.mkdirs(path.dirname(dirpath));
    }
    fs.mkdirSync(dirpath);
  }
}
