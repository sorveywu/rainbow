import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import {Resource} from './resource.entity';
import { Article } from './article.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column({nullable: true})
  sex: string;

  @Column({nullable: true})
  avatar: string;

  // 资源
  @OneToMany(type => Resource, resource => resource.user)
  resources: Resource[];

  // 文章
  @OneToMany(type => Article, article => article.user)
  articles: Article[];

  // 文章类别
  @OneToMany(type => Category, category => category.user)
  categorys: Category[];

  // 标签
  @OneToMany(type => Tag, tag => tag.user)
  tags: Tag[];

  @Column({
    default: 'regular',
  })
  role: string;
}
