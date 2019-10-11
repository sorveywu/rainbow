import { Injectable, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from '../../common/entities/type.entity';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type) private typeRep: Repository<Type>,
  ) {}

  /**
   * 获取所有分类
   */
  async findAll(options): Promise<any> {
    const pageSize = +options.pageSize || 20;    // 每页条数
    const page = options.page * pageSize || 0;  // 当前页
    const [list = [], count = 0] = await this.typeRep.findAndCount({
      where: {
        ...options,
      },
      skip: page,
      take: pageSize,
      order: {
        sort: 'DESC',
      },
    });
    const totalPage = pageSize ? Math.round(count / pageSize) : 1;
    return {
      list,
      total: count,
      pageSize,
      currentPage: options.page,
      totalPage,
    };
  }

  /**
   * 增加分类
   */
  async create(createInput): Promise<any> {
    const cate = this.typeRep.create(createInput);
    try {
      return await this.typeRep.save(cate);
    } catch (err) {
      switch (+err.code) {
        case 23505:
          throw new HttpException('类别名称不能重复', 400);
        default:
          throw new HttpException(err.message, 500);
      }
    }
  }

  /**
   * @param id 修改分类
   */
  async modify(id: any, modifyInput): Promise<any> {
    const existing = await this.findOneById(id);
    if (!existing) {
      throw new HttpException(`更新失败，ID 为 ${id.id} 的类别不存在`, 404);
    }

    existing.name = modifyInput.name;
    existing.sort = modifyInput.sort;
    return await this.typeRep.save(existing);   // 保存
  }

  /**
   * 删除分类
   */
  async delete(id: any): Promise<any> {
    const existing = await this.findOneById(id);
    if (!existing) {
      throw new HttpException(`删除失败，ID 为 ${id.id} 的帖子不存在`, 404);
    }
    return await this.typeRep.delete(id);
  }

  /**
   * 根据id查找分类
   * @param id 分类id
   */
  async findOneById(id: any): Promise<Type> {
    return await this.typeRep.findOne(id);
  }
}
