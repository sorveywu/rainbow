import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import {User} from './user.entity';
import { ResType } from './resType.entity';

@Entity('resource')
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  // 资源名称
  @Column()
  name: string;

  // 资源路径
  @Column({
    nullable: true,
  })
  link: string;

  // 创建时间
  @CreateDateColumn()
  created;

  // 更新时间
  @UpdateDateColumn()
  updated;

  // 创建人
  @ManyToOne(type => User, user => user.resources, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(type => ResType, resType => resType.resources, {
    onDelete: 'CASCADE',
  })
  type: ResType;
  createInput: { id: number; name: string; };
}
