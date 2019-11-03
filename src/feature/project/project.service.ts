import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../../common/entities/project.entity';
import { getRepository, Repository } from 'typeorm';
import { ProjectDTO } from '../../common/dtos/project.dto';
import { TypeService } from '../type/type.service';
import { Type } from '../../common/entities/type.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepo: Repository<Project>,
    private readonly typeServ: TypeService,
  ) {}

  /**
   * 获取所有作品
   * @param options 请求参数
   */
  async find(options): Promise<any> {
    const pageSize = Number(options.pagesize) || 0;     // 每页个数
    const page = Number(options.page) * pageSize || 0;  // 页码

    try {
      const [list = [], count = 0] = await getRepository(Project)
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.type', 'type')
        .select([
          'project.id',
          'project.name',
          'project.link',
          'project.sort',
          'project.onlineAt',
          'type.id',
          'type.name',
        ])
        .orderBy({
          'project.sort': 'DESC',
          'project.id': 'DESC',
        })
        .offset(page)
        .limit(pageSize)
        .getManyAndCount();

      const totalPage = pageSize ? Math.ceil(count / pageSize) : 1;

      return {
        list,
        total: count,
        pageSize,
        currentPage: options.page,
        totalPage,
      };
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  // 新增作品
  async create(createInput: ProjectDTO): Promise<any> {
    const project = this.projectRepo.create(createInput);

    const type = await this.typeServ.findOneById({id: createInput.typeId});

    if (!type) {
      throw new HttpException('项目分类不存在', 404);
    }
    project.type = type;

    try {
      await this.projectRepo.save(project);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  /**
   * @param id 修改文章
   */
  async modify(id: any, modifyInput): Promise<any> {
    const existing = await this.projectRepo.findOne(id);
    if (!existing) {
      throw new HttpException(`更新失败，ID 为 ${id.id} 的作品不存在`, 404);
    }

    const type = await this.typeServ.findOneById({id: modifyInput.typeId});
    if (!type) {
      throw new HttpException('项目分类不存在', 404);
    }

    delete modifyInput.typeId;
    modifyInput.type = type;
    /* Object.assign(existing, modifyInput);
    existing.type = type; */

    try {
      return await this.projectRepo.update(id, modifyInput);   // 保存
      // TODO: 以下暂未弄清楚
      // 此处直接保存existing, 如果type有修改的话会insert 而 不是 update
      // return await this.projectRepo.save(existing);   // 保存
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  /**
   * 删除作品
   */
  async delete(id: any): Promise<any> {
    const existing = await this.getDetail(id);
    if (!existing) {
      throw new HttpException(`删除失败，ID 为 ${id.id} 的作品不存在`, 404);
    }
    try {
      return await this.projectRepo.delete(id);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  /**
   * 获取作品详情
   * @param id 作品id {id: 35}
   */
  async getDetail(id: object): Promise<any> {
    try {
      return await getRepository(Project)
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.type', 'type')
      .select([
        'project.id',
        'project.name',
        'project.picture',
        'project.link',
        'project.description',
        'project.content',
        'project.onlineAt',
        'project.sort',
        'project.isQrcode',
        'project.isTop',
        'type.id',
        'type.name',
      ])
      .where('project.id = :id', {...id})
      .getOne();
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  // 获取分类下的所有项目
  async getProjectByCate(id: any): Promise<any> {
    return await getRepository(Type)
      .createQueryBuilder('type')
      .leftJoinAndSelect('type.projects', 'project')
      .select([
        'type.id',
        'type.name',
        'project.id',
        'project.name',
        'project.picture',
        'project.link',
        'project.description',
        'project.sort',
        'project.onlineAt',
        'project.isTop',
      ])
      .where('type.id = :id', {...id})
      .orderBy({
        'project.sort': 'DESC',
        'project.id': 'ASC',
      })
      .getOne();
  }

  // 获取项目分类及以下的项目
  async getProjectGroupByCate(): Promise<any> {
    return await getRepository(Type)
      .createQueryBuilder('type')
      .leftJoinAndSelect('type.projects', 'project', 'project.isTop = :isTop', {isTop: true})
      .select([
        'type.id',
        'type.name',
        'project.id',
        'project.name',
        'project.link',
        'project.picture',
        'project.description',
        'project.content',
        'project.sort',
        'project.isQrcode',
        'project.onlineAt',
        'project.isTop',
      ])
      .orderBy({
        'type.sort': 'DESC',
        'project.sort': 'DESC',
        'project.onlineAt': 'DESC',
        'project.id': 'ASC',
      })
      .getMany();
  }
}
