import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../common/entities/category.entity';
import { Repository, ObjectID } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private cateRep: Repository<Category>,
  ) {}

  /**
   * 获取所有分类
   */
  async findAll(options): Promise<any> {
    const pageSize = +options.pageSize || 20;    // 每页条数
    const page = options.page * pageSize || 0;  // 当前页
    const [list = [], count = 0] = await this.cateRep.findAndCount({
      where: {
        ...options,
      },
      skip: page,
      take: pageSize,
      order: {
        sort: 'DESC',
      },
      relations: ['user'],
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
    const cate = this.cateRep.create(createInput);
    try {
      return await this.cateRep.save(cate);
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
    existing.user = modifyInput.user;
    return await this.cateRep.save(existing);   // 保存
  }

  /**
   * 删除分类
   */
  async delete(id: any): Promise<any> {
    const existing = await this.findOneById(id);
    if (!existing) {
      throw new HttpException(`删除失败，ID 为 ${id.id} 的帖子不存在`, 404);
    }
    return await this.cateRep.delete(id);
  }

  /**
   * 根据id查找分类
   * @param id 分类id
   */
  async findOneById(id: any): Promise<Category> {
    return await this.cateRep.findOne(id, {
      relations: ['user'],
    });
  }
}
