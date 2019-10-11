import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    nullable: false,
    name: 'createAt',
    comment: '创建时间',
  })
  createAt: Date | string;

  @UpdateDateColumn({
    nullable: false,
    name: 'updateAt',
    comment: '更新时间',
  })
  updateAt: Date | string;

}
