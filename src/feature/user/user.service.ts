import { Injectable, Inject, OnModuleInit, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../common/entities/user.entity';
import { CryptoUtil } from '../../common/utils/crypto.util';

@Injectable()
export class UserService implements OnModuleInit {
  async onModuleInit() {
    if (await this.findOneByAccount('admin')) { return; }
    // 初始化系统管理员
    const admin = this.userRepo.create({
      account: 'yourname',
      password: this.cryptoUtil.encryptPassword('your password'),
      nickname: 'yournickname',
      email: 'youremail',
      role: 'admin',
    });
    await this.userRepo.save(admin);
  }

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(CryptoUtil) private readonly cryptoUtil: CryptoUtil,
  ) {}

  /**
   * 用户登录
   * @param account 登录账号
   * @param password 登录密码
   */
  async login(account: string, password: string): Promise<void> {
    const user = await this.findOneByAccount(account);
    // 如果没有账号，返回错误信息
    if (!user) {
      throw new HttpException('登录账号有误', 406);
    }
    if (!this.cryptoUtil.checkPassword(password, user.password)) {
      throw new HttpException('登录密码有误', 406);
    }
  }

  /**
   * 用户注册
   * @param user 用户
   */
  async register(user: User): Promise<void> {
    const existing = await this.findOneByAccount(user.account);
    if (existing) {
      throw new HttpException('账号已存在', 409);
    }
    user.password = this.cryptoUtil.encryptPassword(user.password);
    await this.userRepo.save(this.userRepo.create(user));
  }

  /**
   * 删除用户
   * @param id 用户id
   */
  async remove(id: number): Promise<void> {
    const existing = await this.findOneById(id);
    if (!existing) {
      throw new HttpException(`删除失败，ID：${id}的用户不存在`, 404);
    }
    if (existing.account === 'admin') {
      throw new HttpException(`删除失败，不能删除该用户`, 403);
    }
    await this.userRepo.remove(existing);
  }

  /**
   * 根据id查找用户
   * @param id 用户id
   */
  async findOneById(id: any): Promise<User> {
    return await this.userRepo.findOne(id);
  }

  /**
   * 查找所有的用户
   */
  async findAll(): Promise<User[]> {
    return await this.userRepo.find({
      select: ['account', 'sex', 'role', 'nickname'],
    });
  }

  /**
   * 通过登录账号查询用户
   * @param account 登录账号
   */
  async findOneByAccount(account: string): Promise<User> {
    return await this.userRepo.findOne({ account });
  }

}
