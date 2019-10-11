import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { Resource } from './resource.entity';

@Entity('resType')
export class ResType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // 创建时间
  @CreateDateColumn()
  created;

  // 更新时间
  @UpdateDateColumn()
  updated;

  @OneToMany(type => Resource, resource => resource.type)
  resources: Resource[];
}
