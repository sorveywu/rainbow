import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from '../../common/entities/resource.entity';
import { ResType } from '../../common/entities/resType.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource) private readonly resRepo: Repository<Resource>,
    @InjectRepository(ResType) private readonly resType: Repository<ResType>,
  ) {}

  async create(createInput: Resource): Promise<void> {
    await this.resRepo.save(createInput);
  }

  // TODO:
  // 写一个查询测试数据库方法
  async findAll(): Promise<Resource[]> {
    return await this.resRepo.find({
      relations: ['user'],
    });
  }

  // 根据id查找资源类型
  async findResType(id: number): Promise<ResType> {
    return await this.resType.findOne(id);
  }
}
