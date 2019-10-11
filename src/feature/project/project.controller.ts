import { Controller, Inject, Get, Query, UseGuards, UsePipes, ValidationPipe, Post, Body, Delete, Param, Put, ParseIntPipe } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Result } from '../../common/interfaces/result.interface';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ProjectDTO } from '../../common/dtos/project.dto';

@Controller('/api/project')
@UseGuards(AuthGuard(), RolesGuard)
@UsePipes(new ValidationPipe({
  transform: true,
  dismissDefaultMessages: true,
  validationError: {
  target: false,
  value: false,
}}))
export class ProjectController {
  constructor(
    @Inject(ProjectService) private readonly projectService: ProjectService,
  ) {}

  /**
   * 获取所有作品
   * @param options 请求参数
   */
  @Get()
  @Roles('admin', 'regular')
  async find(@Query() options): Promise<Result> {
    const res = await this.projectService.find(options);
    return {code: 200, message: '查询成功', data: res};
  }

  /**
   * 获取项目详情
   * @param id 文章id
   */
  @Get('/detail/:id')
  async getDetial(@Param('id', new ParseIntPipe()) id): Promise<Result> {
    const res = await this.projectService.getDetail({id});
    return {code: 200, message: '项目获取成功!', data: res};
  }

  @Post()
  @Roles('admin', 'regular')
  async create(@Body() createInput: ProjectDTO): Promise<Result> {
    await this.projectService.create(createInput);
    return {code: 200, message: '作品新建成功'};
  }

  /**
   * 修改作品
   * @param id 作品id
   * @param modInput 输入字段
   */
  @Put(':id')
  @Roles('admin')
  async modify(@Param() id: number, @Body() modifyInput: ProjectDTO): Promise<Result> {
    await this.projectService.modify(id, modifyInput);
    return {code: 200, message: '修改成功'};
  }

  /**
   * 删除作品
   * @param id 作品id
   */
  @Delete(':id')
  @Roles('admin')
  async delete( @Param() id: number): Promise<Result> {
    await this.projectService.delete(id);
    return {code: 200, message: '删除成功'};
  }

  /**
   * 根据类别获取所有的作品
   */
  @Get('/type/:id')
  async getProjectsOfType(@Param() id): Promise<Result> {
    const res = await this.projectService.getProjectByCate(id);
    return {code: 200, message: '查询成功', data: res};
  }
}
