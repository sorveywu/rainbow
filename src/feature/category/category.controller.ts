import { Controller, Post, Body, UseGuards, ValidationPipe, UsePipes, Query, Get, Delete, Param, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Result } from '../../common/interfaces/result.interface';
import { User } from '../../common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CateDTO } from '../../common/dtos/cate.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';

@Controller('/api/category')
@UseGuards(AuthGuard(), RolesGuard)
@UsePipes(new ValidationPipe({transform: true}))
export class CategoryController {
  constructor(
    private readonly cateServ: CategoryService,
  ) {}

  @Get()
  async findAll(@Query() options): Promise<Result> {
    const res = await this.cateServ.findAll(options);
    return { code: 200, message: '查询成功', data: res };
  }

  /**
   * 新增类别
   * @param user 授权用户
   * @param options 输入参数
   */
  @Post()
  @Roles('admin')
  async create(@User() user, @Body() createInput: CateDTO): Promise<Result> {
    createInput.user = user;  // 注入权限用户
    await this.cateServ.create(createInput);
    return { code: 200, message: '分类添加成功'};
  }

  /**
   * 删除分类
   * @param id 分类id
   */
  @Delete(':id')
  @Roles('admin')
  async delete( @Param() id: number): Promise<Result> {
    await this.cateServ.delete(id);
    return {code: 200, message: '删除成功'};
  }

  /**
   * 修改分类
   * @param user 授权用户
   * @param id 分类id
   * @param modInput 分类参数
   */
  @Put(':id')
  @Roles('admin')
  async modify(@User() user, @Param() id: number, @Body() modInput: CateDTO): Promise<Result> {
    modInput.user = user;
    await this.cateServ.modify(id, modInput);
    return {code: 200, message: '修改成功'};
  }
}
