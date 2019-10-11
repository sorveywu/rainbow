import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../../feature/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthStrategy } from './auth.strategy';

@Module({
  imports: [
    JwtModule.register({  // 向 nest 容器注册 jwt 模块，并配置密钥和令牌有效期
      secret: 'sorvey',
      signOptions: {
        expiresIn: 3600 * 24, // 单位：秒
      },
    }),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, AuthStrategy],
  exports: [AuthService], // 导出 AuthService 供 UserMoudle 使用
})
export class AuthModule {}
