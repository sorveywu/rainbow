import { Controller, Inject, Get, Query, Param, ParseIntPipe, HttpException } from '@nestjs/common';
import { ArticleService } from '../article/article.service';
import { TagService } from '../tag/tag.service';
import { Result } from '../../common/interfaces/result.interface';
import { CategoryService } from '../category/category.service';
import { ResumeService } from '../resume/resume.service';
import { ProjectService } from '../project/project.service';

@Controller('/front/api/v1')
export class FrontController {
  constructor(
    @Inject(ArticleService) private articleService: ArticleService,
    @Inject(TagService) private tagService: TagService,
    @Inject(CategoryService) private cateService: CategoryService,
    @Inject(ResumeService) private resumeService: ResumeService,
    @Inject(ProjectService) private projectService: ProjectService,
  ) {}

  @Get('/article')
  async findAllArticle(@Query() options): Promise<Result> {
    const res = await this.articleService.find(options);
    return { code: 200, message: '查询成功', data: res };
  }

  /**
   * 获取文章详情
   * @param id 文章id
   */
  @Get('/article/:id')
  async getDetial(@Param('id', new ParseIntPipe()) id): Promise<Result> {
    await this.articleService.increment({id});
    const res = await this.articleService.getDetail({id});
    if (!res) {
      throw new HttpException(`id为${id}的文章不存在！`, 404);
    } else {
      return {code: 200, message: '文章获取成功!', data: res};
    }
  }

  /**
   * @param options 获取所有分类
   */
  @Get('/category')
  async findAllCategory(@Query() options): Promise<Result> {
    const res = await this.cateService.findAll(options);
    return { code: 200, message: '查询成功', data: res };
  }

  /**
   * @param options 获取所有tag
   */
  @Get('/tag')
  async findAllTag(@Query() options): Promise<Result> {
    const res = await this.tagService.findAll(options);
    return { code: 200, message: '查询成功', data: res };
  }
  /**
   * 获取标签下的所有文章
   * @param id tagId
   */
  @Get('/tag/:id')
  async getArticelOfTag(@Param('id', new ParseIntPipe()) id): Promise<Result> {
    const res = await this.tagService.findArticleOfTag(id);
    return { code: 200, message: '查询成功', data: res };
  }
  /**
   * 获取分类下的所有文章
   * @param id cateId
   */
  @Get('/category/:id')
  async getArticelOfCate(@Query() options, @Param('id', new ParseIntPipe()) id): Promise<Result> {
    const res = await this.articleService.findByCate(options, id);
    return { code: 200, message: '查询成功', data: res };
  }

  /**
   * 获取我的简历
   */
  @Get('/resume')
  async getResume(): Promise<Result> {
    const res = await this.resumeService.getResume();
    return {code: 200, message: '查询成功', data: res};
  }

  /**
   * 获取所有的作品
   */
  @Get('/project')
  async getAllProject(): Promise<Result> {
    const res = await this.projectService.getProjectGroupByCate();
    return {code: 200, message: '查询成功', data: res};
  }

  /**
   * 获取项目详情
   */
  @Get('/project/:id')
  async getProjectById(@Param('id', new ParseIntPipe()) id): Promise<Result> {
    const res = await this.projectService.getDetail({id});
    if (!res) {
      throw new HttpException(`id为${id}的项目不存在！`, 404);
    } else {
      return {code: 200, message: '项目获取成功!', data: res};
    }
  }

  /**
   * 获取所有的作品
   */
  @Get('/type/:id')
  async getWorksOfType(@Param() id): Promise<Result> {
    console.log(id);
    const res = await this.projectService.getProjectByCate(id);
    return {code: 200, message: '查询成功', data: res};
  }
}
