import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../../common/entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private tagRep: Repository<Tag>,
  ) {}

  /**
   * 获取所有tag
   */
  async findAll(options): Promise<any> {
    const pageSize = +options.pageSize || 20;    // 每页条数
    const page = options.page * pageSize || 0;  // 当前页
    const [list = [], count = 0] = await this.tagRep.findAndCount({
      where: {
        ...options,
      },
      skip: page,
      take: pageSize,
      relations: ['user', 'articles'],
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
   * 添加tag
   */
  async create(createInput): Promise<any> {
    const cate = this.tagRep.create(createInput);
    try {
      return await this.tagRep.save(cate);
    } catch (err) {
      switch (+err.code) {
        case 23505:
          throw new HttpException('标签名称不能重复', 400);
        default:
          throw new HttpException(err.message, 500);
      }
    }
  }

  /**
   * @param id 修改tag
   */
  async modify(id: any, modifyInput): Promise<any> {
    const existing = await this.findOneById(id);
    if (!existing) {
      throw new HttpException(`更新失败，ID 为 ${id.id} 的tag不存在`, 404);
    }
    existing.name = modifyInput.name;
    existing.user = modifyInput.user;
    return await this.tagRep.save(existing);   // 保存
  }

  /**
   * 删除tag
   */
  async delete(id: any): Promise<any> {
    const existing = await this.findOneById(id);
    if (!existing) {
      throw new HttpException(`删除失败，ID 为 ${id.id} 的tag不存在`, 404);
    }
    return await this.tagRep.delete(id);
  }

  /**
   * @desc 根据数组获取tags
   * @param options
   */
  async findIds(options: number[]): Promise<any> {
    return await this.tagRep.findByIds(options);
  }

  /**
   * 根据id查找tag
   * @param id 分类id
   */
  async findOneById(id: any): Promise<Tag> {
    return await this.tagRep.findOne(id, {
      relations: ['user'],
    });
  }

  /**
   * 根据id查找tag
   * @param id 分类id
   */
  async findArticleOfTag(id: any): Promise<Tag> {
    return await this.tagRep.findOne(id, {
      relations: ['articles'],
    });
  }
}
