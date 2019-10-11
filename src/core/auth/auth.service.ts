import { Injectable, Inject } from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import { UserService } from '../../feature/user/user.service';
import { User } from '../../common/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  // 生成token
  async createToken(payload: {account: string}): Promise<string> {
    return this.jwtService.sign(payload);
  }

  // 检查用户是否正确
  async validateUser(payload: {account: string}): Promise<User> {
    return await this.userService.findOneByAccount(payload.account);
  }
}
