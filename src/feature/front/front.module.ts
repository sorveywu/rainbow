import { Module } from '@nestjs/common';
import { FrontController } from './front.controller';
import { ArticleModule } from '../article/article.module';
import { TagModule } from '../tag/tag.module';
import { CategoryModule } from '../category/category.module';
import { ResumeModule } from '../resume/resume.module';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [ArticleModule, TagModule, CategoryModule, ResumeModule, ProjectModule],
  controllers: [FrontController],
})
export class FrontModule {}
