import { Controller, Get, UseGuards, Post, Body, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Result } from '../../common/interfaces/result.interface';
import { User } from '../../common/decorators/user.decorator';
import { Resource } from '../../common/entities/resource.entity';
import { ResourceService } from './resource.service';
import { ResourceDto } from '../../common/dtos/resource.dto';

@Controller('/api/resource')
export class ResourceController {
  constructor(
    @Inject(ResourceService) private readonly resServ: ResourceService,
  ) {}

  /**
   * 获取所有资源
   */
  @Post()
  @UseGuards(AuthGuard())
  async getAllResources(@User() user, @Body() createInput: ResourceDto): Promise<Result> {
    createInput.user = user;
    // 这里的type该怎么传
    const resType = this.resServ.findResType(createInput.type);
    return {code: 200, message: '创建成功'};
  }

  @Get()
  async findAll() {
    const data = await this.resServ.findAll();
    return {code: 200, message: '查询所有资源成功', data};
  }

}
