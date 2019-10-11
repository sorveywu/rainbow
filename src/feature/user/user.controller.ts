import { Controller, Get, Param, Post, Body, UsePipes, Inject, UseGuards, Delete, Query, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import {AuthGuard} from '@nestjs/passport';
import {AuthService} from '../../core/auth/auth.service';
import {Roles} from '../../common/decorators/roles.decorator';
import { Result } from '../../common/interfaces/result.interface';   // 返回结果接口
import { RolesGuard } from '../../core/guards/roles.guard';
import { User } from '../../common/entities/user.entity';

@Controller('/api/user')
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(AuthService) private readonly authSerivce: AuthService,
  ) { }

  /**
   * 用户登录成功后，返回的 data 是授权令牌；
   * 在调用有 @UseGuards(AuthGuard()) 注解的路由时，会检查当前请求头中是否包含 Authorization: Bearer xxx 授权令牌，
   * 其中 Authorization 是用于告诉服务端本次请求有令牌，并且令牌前缀是 Bearer，而令牌的具体内容是登录之后返回的 data(accessToken)。
   */
  @Post('/login')
  async login(@Body() body: { account: string, password: string }): Promise<Result> {
    await this.userService.login(body.account, body.password);
    const accessToken = await this.authSerivce.createToken({
      account: body.account,
    });
    return { code: 200, message: '登录成功', data: {accessToken},
    };
  }

  /**
   * 用户注册
   * @param user 用户模型
   */
  @Roles('admin')
  @UseGuards(AuthGuard(), RolesGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/register')
  async register(@Body() user: User): Promise<Result> {
    await this.userService.register(user);
    return { code: 200, message: '用户添加成功'};
  }

  /**
   * 使用 @Roles() 装饰器，为路由注入可访问权限。配合RolesGuard
   * 可在 roles.guard 中反射获取 roles 注入的权限值
   * 只有注入的角色才能访问对应权限
   * 删除用户
   * @param id 用户id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(AuthGuard(), RolesGuard)
  async remove(@Param('id') id: number): Promise<any> {
    await this.userService.remove(id);
    return {code: 200, message: '用户删除成功'};
  }

  @Get('/all')
  @Roles('admin', 'regular')
  @UseGuards(AuthGuard(), RolesGuard)
  async findAll(): Promise<Result> {
    const data = await this.userService.findAll();
    return { code: 200, message: '查询所有用户成功', data };
  }
}
