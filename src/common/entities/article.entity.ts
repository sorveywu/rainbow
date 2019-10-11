import { Entity, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import {BaseEntity} from './base.entity';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';

@Entity()
export class Article extends BaseEntity {
  // 文章标题
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    nullable: true,
  })
  picture: string;

  @Column({
    type: 'text', // 文本类型
  })
  content: string;

  // 排序
  @Column({
    default: 0,
  })
  sort: number;

  // 用户关联，创建用户
  @ManyToOne(type => User, user => user.articles, {
    cascade: true,  // 如果设置为 true，则将插入相关对象并在数据库中更新。
    onDelete: 'CASCADE',
    primary: true,  // 指示此关系的列是否为主列。
  })
  user: User;

  // 类别
  @ManyToOne(type => Category, category => category.articles, {
    cascade: true,  // 如果设置为 true，则将插入相关对象并在数据库中更新。
    onDelete: 'CASCADE',
    primary: true,
  })
  @JoinColumn()
  category: Category;

  @Column({
    comment: '发布时间',
    type: 'timestamp',
    nullable: true,
  })
  onlineAt?: string;

  // 标签
  @ManyToMany(type => Tag, tag => tag.articles)
  @JoinTable()
  tags: Tag[];

  // 阅读数
  @Column({
    default: 0,
    comment: '阅读数',
  })
  views: number;
}
