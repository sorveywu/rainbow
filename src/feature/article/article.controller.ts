import { Controller, Inject, Post, Body, UseGuards, UsePipes, ValidationPipe, Get, Query, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleDTO } from '../../common/dtos/article.dto';
import { Result } from '../../common/interfaces/result.interface';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../core/guards/roles.guard';
import { User } from '../../common/decorators/user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('/api/article')
@UseGuards(AuthGuard(), RolesGuard)
@UsePipes(new ValidationPipe({
  transform: true,
  dismissDefaultMessages: true,
  validationError: {
  target: false,
  value: false,
}}))
export class ArticleController {
  constructor(
    @Inject(ArticleService) private readonly articleService: ArticleService,
  ) {}

  @Get()
  async find(@Query() options): Promise<Result> {
    const res = await this.articleService.find(options);
    return { code: 200, message: '查询成功', data: res };
  }

  /**
   * 新增文章
   * @param user 授权用户
   * @param createInput 文章字段
   */
  @Post()
  @Roles('admin', 'regular')
  async create(@User() user, @Body() createInput: ArticleDTO): Promise<Result> {
    createInput.user = user;
    await this.articleService.create(createInput);
    return {code: 200, message: '文章创建成功!'};
  }

  /**
   * 获取文章详情
   * @param id 文章id
   */
  @Get('/detail/:id')
  async getDetial(@Param('id', new ParseIntPipe()) id): Promise<Result> {
    await this.articleService.increment({id});
    const res = await this.articleService.getDetail({id});
    return {code: 200, message: '文章获取成功!', data: res};
  }

  /**
   * 修改文章
   * @param user 授权用户
   * @param id 分类id
   * @param modInput 分类参数
   */
  @Put(':id')
  @Roles('admin')
  async modify(@User() user, @Param() id: number, @Body() modifyInput: ArticleDTO): Promise<Result> {
    modifyInput.user = user;
    await this.articleService.modify(id, modifyInput);
    return {code: 200, message: '修改成功'};
  }

  /**
   * 删除文章
   * @param id 分类id
   */
  @Delete(':id')
  @Roles('admin')
  async delete( @Param() id: number): Promise<Result> {
    await this.articleService.delete(id);
    return {code: 200, message: '删除成功'};
  }
}
