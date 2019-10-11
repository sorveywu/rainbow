import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../common/entities/user.entity';
import { CommonModule } from '../../common/common.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../../core/auth/auth.module';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([User]),   // 引入user.entity，才能在service调用
    forwardRef(() => AuthModule), // 处理模块间的循环依赖
    CommonModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
