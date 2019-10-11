import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Type } from './type.entity';

@Entity()
export class Project extends BaseEntity {
  // 项目名称
  @Column({
    comment: '项目名称',
  })
  name: string;

  @Column({
    comment: '项目图片',
  })
  picture: string;

  @Column({
    comment: '项目链接',
  })
  link: string;

  @Column({
    comment: '项目描述',
  })
  description: string;

  @Column({
    comment: '项目具体信息',
    type: 'text',
  })
  content: string;

  @Column({
    comment: '上线时间',
    type: 'timestamp',
    nullable: true,
  })
  onlineAt: string;

  @Column({
    comment: '是否置顶',
    default: false,
  })
  isTop: boolean;

  @Column({
    comment: '是否最新',
    default: false,
  })
  isNew: boolean;

  // 排序
  @Column()
  sort: number;

  // 类别
  @ManyToOne(type => Type, type => type.projects, {
    cascade: true,  // 如果设置为 true，则将插入相关对象并在数据库中更新。
    onDelete: 'CASCADE',
    primary: true,
  })
  type: Type;
}
