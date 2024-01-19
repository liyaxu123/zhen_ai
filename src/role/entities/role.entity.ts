import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectId,
} from 'typeorm';
import { Permission } from '../../permission/entities/permission.entity';

@Entity()
export class Role {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({
    length: 50,
    comment: '角色名称',
  })
  name: string;

  @Column({
    length: 50,
    comment: '角色描述',
  })
  desc: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;

  @Column(() => Permission)
  permissions: Permission[];
}
