import { Controller, UseGuards, UsePipes, ValidationPipe, Get, Query, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../core/guards/roles.guard';
import { TypeService } from './type.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Result } from '../../common/interfaces/result.interface';
import { TypeDTO } from '../../common/dtos/type.dto';

@Controller('/api/type')
@UseGuards(AuthGuard(), RolesGuard)
@UsePipes(new ValidationPipe({transform: true}))
export class TypeController {
  constructor(
    private readonly typeServ: TypeService,
  ) {}

  @Get()
  async findAll(@Query() options): Promise<Result> {
    const res = await this.typeServ.findAll(options);
    return { code: 200, message: '查询成功', data: res };
  }

  /**
   * 新增类别
   * @param user 授权用户
   * @param options 输入参数
   */
  @Post()
  @Roles('admin')
  async create(@Body() createInput: TypeDTO): Promise<Result> {
    await this.typeServ.create(createInput);
    return { code: 200, message: '分类添加成功'};
  }

  /**
   * 删除分类
   * @param id 分类id
   */
  @Delete(':id')
  @Roles('admin')
  async delete( @Param() id: number): Promise<Result> {
    await this.typeServ.delete(id);
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
  async modify(@Param() id: number, @Body() modInput: TypeDTO): Promise<Result> {
    await this.typeServ.modify(id, modInput);
    return {code: 200, message: '修改成功'};
  }
}
