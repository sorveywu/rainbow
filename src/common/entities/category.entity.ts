import { Entity, Column, OneToMany, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Article } from './article.entity';
import { User } from './user.entity';

@Entity()
@Unique(['name'])
export class Category extends BaseEntity {
  // 类别名称
  @Column()
  name: string;

  @Column({
    default: 0,
  })
  sort: number;

  // 对应的文章，一对多
  @OneToMany(type => Article, article => article.category)
  articles: Article[];

  // 对应用户, 多对一
  @ManyToOne(type => User, user => user.categorys, {
    cascade: true,
    onDelete: 'CASCADE',
    primary: true,
  })
  user: User;
}
