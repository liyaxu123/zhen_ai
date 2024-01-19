import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectId,
} from 'typeorm';

@Entity()
export class Permission {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({
    length: 50,
    comment: '权限code',
  })
  code: string;

  @Column({ length: 50, comment: '权限描述' })
  desc: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;
}
