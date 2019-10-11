import { Entity, Column, ManyToOne, ManyToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Article } from './article.entity';
import { User } from './user.entity';

@Entity()
@Unique(['name'])
export class Tag extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(type => Article, article => article.tags)
  articles: Article[];

  @ManyToOne(type => User, user => user.tags, {
    cascade: true,  // 如果设置为 true，则将插入相关对象并在数据库中更新。
    onDelete: 'CASCADE',
  })
  user: User;
}
