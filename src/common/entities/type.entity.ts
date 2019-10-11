import { Entity, Column, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Project } from './project.entity';

@Entity()
@Unique(['name'])
export class Type extends BaseEntity {
  // 类别名称
  @Column()
  name: string;

  @Column({
    default: 0,
  })
  sort: number;

  // 对应的项目，一对多
  @OneToMany(type => Project, project => project.type)
  projects: Project[];

}
