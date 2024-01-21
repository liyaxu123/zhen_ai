import {
  Column,
  Entity,
  ObjectId,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @Column({
    comment: '头像',
  })
  avatar: string;

  @Column({
    comment: '昵称',
  })
  nickname: string;

  @Column({
    comment: '手机号',
    length: 11,
  })
  tel: string;

  @Column({
    comment: '邮箱地址',
  })
  email: string;

  @Column({
    comment: '个人简介',
    length: 200,
  })
  intro: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;

  @Column(() => Role)
  roles: Role[];
}
