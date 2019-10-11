import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Resume extends BaseEntity {
  @Column({
    type: 'text',
    nullable: true,
  })
  content: string;
}
