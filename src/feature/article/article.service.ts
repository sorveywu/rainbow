import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../../common/entities/article.entity';
import { Repository, getRepository } from 'typeorm';
import { ArticleDTO } from '../../common/dtos/article.dto';
import { CategoryService } from '../category/category.service';
import { TagService } from '../tag/tag.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepo: Repository<Article>,
    private readonly cateServ: CategoryService,
    private readonly tagServ: TagService,
  ) {}

  /**
   * 获取文章列表
   * @param options 查询参数
   */
  async find(options): Promise<any> {
    const pageSize = Number(options.pagesize) || 0;
    const page = Number(options.page) * pageSize || 0;
    let param = {};
    let term = '';
    if (options.search) {
      term = 'article.title Like :title OR article.description Like :description OR article.content Like :content';
      param = {
        title: `%${options.search}%`,
        description: `%${options.search}%`,
        content: `%${options.search}%`,
      };
    }
    try {
      const [list = [], count = 0] = await getRepository(Article)
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.user', 'u')
        .leftJoinAndSelect('article.category', 'category')
        .select([
          'article.id',
          'article.description',
          'article.picture',
          'article.createAt',
          'article.updateAt',
          'article.onlineAt',
          'article.title',
          'article.views',
          'u.id',
          'u.nickname',
          'category.id',
          'category.name',
        ])
        .where(term, param)
        .orderBy({
          'article.onlineAt': 'DESC',
          'article.id': 'DESC',
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

  /**
   * 新建文章
   * @param createInput 文章字段
   */
  async create(createInput: ArticleDTO): Promise<any> {
    const article = this.articleRepo.create(createInput);

    /**
     * const cate = await this.cateServ.findOneById({id: createInput.cateId});
     * 这种写法，获取cate实体的时候并没有关联获取user，所以在更新的时候会报错：更新categrory时 userId 不存在，如下：
     * query failed: INSERT INTO "category"("createAt", "updateAt", "name", "userId") VALUES (DEFAULT,
     *  DEFAULT, $1, DEFAULT) RETURNING "id", "createAt", "updateAt" -- PARAMETERS: ["博客文章"]
     * error: null value in column \"userId\" violates not-null constraint
     * 所以需要手动给cate.user 赋值：
     * cate.user = createInput.user;
     * 所以需要在获取cate时同时relation获取user
     */

    // const cate = await this.cateServ.findOneById({id: createInput.cateId});
    // cate.user = createInput.user;

    const cate = await this.cateServ.findOneById({id: createInput.cateId});
    if (!cate) {
      throw new HttpException('文章分类不存在', 404);
    }

    const tags = await this.tagServ.findIds(createInput.tagsId);
    if (!tags) {
      throw new HttpException('标签不存在', 404);
    }

    article.category = cate;
    article.user = createInput.user;
    article.tags = tags;

    try {
      await this.articleRepo.save(article);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  /**
   * 文章阅读数+1
   * @param id 文章id
   */
  async increment(id: object): Promise<any> {
    try {
      await this.articleRepo.increment(id, 'views', 1);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  /**
   * 获取文章详情
   * @param id 文章id {id: 35}
   */
  async getDetail(id: object): Promise<any> {
    try {
      return await getRepository(Article)
      .createQueryBuilder('article')
      .leftJoin('article.user', 'u')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .select([
        'article.id',
        'article.description',
        'article.picture',
        'article.title',
        'article.createAt',
        'article.updateAt',
        'article.onlineAt',
        'article.views',
        'article.content',
        'u.id',
        'u.nickname',
        'category.id',
        'category.name',
        'tags.id',
        'tags.name',
      ])
      .where('article.id = :id', {...id})
      .getOne();
      /* return await this.articleRepo.findOneOrFail(id, {
        relations: ['category', 'tags'],
      }); */
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  /**
   * @param id 修改文章
   */
  async modify(id: any, modifyInput): Promise<any> {
    const existing = await this.getDetail(id);
    if (!existing) {
      throw new HttpException(`更新失败，ID 为 ${id.id} 的文章不存在`, 404);
    }

    const cate = await this.cateServ.findOneById({id: modifyInput.cateId});
    if (!cate) {
      throw new HttpException('文章分类不存在', 404);
    }

    const tags = await this.tagServ.findIds(modifyInput.tagsId);

    if (!tags) {
      throw new HttpException('标签不存在', 404);
    }

    Object.assign(existing, modifyInput);
    existing.category = cate;
    existing.tags = tags;

    try {
      return await this.articleRepo.save(existing);   // 保存
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  /**
   * 删除文章
   */
  async delete(id: any): Promise<any> {
    const existing = await this.getDetail(id);
    if (!existing) {
      throw new HttpException(`删除失败，ID 为 ${id.id} 的文章不存在`, 404);
    }
    try {
      return await this.articleRepo.delete(id);
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  /**
   * 获取文章列表
   * @param options 查询参数
   */
  async findByCate(options, cateId): Promise<any> {
    const existing = await this.cateServ.findOneById({id: cateId});
    if (!existing) {
      throw new HttpException('文章分类不存在', 404);
    }
    const pageSize = Number(options.pagesize) || 0;
    const page = Number(options.page) * pageSize || 0;
    try {
      const [list = [], count = 0] = await getRepository(Article)
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.user', 'user')
        .leftJoinAndSelect('article.category', 'category')
        .select([
          'article.id',
          'article.description',
          'article.picture',
          'article.createAt',
          'article.updateAt',
          'article.onlineAt',
          'article.title',
          'article.views',
          'category.id',
          'category.name',
          'user.id',
          'user.nickname',
        ])
        .where('category.id = :id', {id: cateId})
        .orderBy({
          'article.onlineAt': 'DESC',
          'article.id': 'DESC',
        })
        .offset(page)
        .limit(pageSize)
        .getManyAndCount();

      const totalPage = pageSize ? Math.ceil(count / pageSize) : 1;

      return {
        cateId: existing.id,
        cateName: existing.name,
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

}
