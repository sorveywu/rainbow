import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './feature/user/user.module';
import { AuthModule } from './core/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ErrorsInterceptor } from './core/interceptors/errors.interceptor';
import { ResourceModule } from './feature/resource/resource.module';
import { CategoryModule } from './feature/category/category.module';
import { ArticleModule } from './feature/article/article.module';
import { UploadModule } from './feature/upload/upload.module';
import { FrontModule } from './feature/front/front.module';
import { TagModule } from './feature/tag/tag.module';
import { ResumeModule } from './feature/resume/resume.module';
import { ProjectModule } from './feature/project/project.module';
import { TypeModule } from './feature/type/type.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),  // 建立typeorm与数据库的连接，配置文件在ormconfig.json
    UserModule,
    AuthModule,
    ResourceModule,
    CategoryModule,
    ArticleModule,
    UploadModule,
    FrontModule,
    TagModule,
    ResumeModule,
    ProjectModule,
    TypeModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,   // 全局拦截器，这里使用全局异常拦截器改写异常消息结构
    useClass: ErrorsInterceptor,
  }],
})
export class AppModule {}
