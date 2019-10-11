import { Controller, UseGuards, UsePipes, ValidationPipe, Post, Body, Query, Get, Delete, Param, Put } from '@nestjs/common';
import { TagService } from './tag.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../core/guards/roles.guard';
import { User } from '../../common/decorators/user.decorator';
import { TagDTO } from '../../common/dtos/tag.dto';
import { Result } from '../../common/interfaces/result.interface';

@Controller('/api/tag')
@UseGuards(AuthGuard(), RolesGuard)
@UsePipes(new ValidationPipe({transform: true}))
export class TagController {
  constructor(
    private readonly tagService: TagService,
  ) {}

  @Get()
  async findAll(@Query() options): Promise<Result> {
    const res = await this.tagService.findAll(options);
    return { code: 200, message: '查询成功', data: res };
  }

  /**
   * 新增tag
   * @param user 授权用户
   * @param options 输入参数
   */
  @Post()
  @Roles('admin')
  async create(@User() user, @Body() createInput: TagDTO): Promise<Result> {
    createInput.user = user;  // 注入权限用户
    await this.tagService.create(createInput);
    return { code: 200, message: '分类添加成功'};
  }

  /**
   * 删除tag
   * @param id tagDd
   */
  @Delete(':id')
  @Roles('admin')
  async delete(@Param() id: number): Promise<Result> {
    await this.tagService.delete(id);
    return {code: 200, message: '删除成功'};
  }

  /**
   * 修改tag
   * @param user 授权用户
   * @param id tagid
   * @param modInput tag参数
   */
  @Put(':id')
  @Roles('admin')
  async modify(@User() user, @Param() id: number, @Body() modInput: TagDTO): Promise<Result> {
    modInput.user = user;
    await this.tagService.modify(id, modInput);
    return {code: 200, message: '修改成功'};
  }
}
