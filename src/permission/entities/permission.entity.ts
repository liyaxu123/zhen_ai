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
    comment: '父级ID',
  })
  pid: string;

  @Column({
    comment: '菜单名称/权限名称',
  })
  name: string;

  @Column({
    comment: 'Icon 图标',
  })
  icon: string;

  @Column({
    comment: '权限标识',
  })
  perms: string;

  @Column({
    comment: '菜单对应的前端组件',
  })
  component: string;

  @Column({
    comment: '菜单类型 M: 目录 C: 菜单 F: 按钮',
  })
  menuType: 'M' | 'C' | 'F';

  @Column({
    comment: '显示排序',
  })
  sort: number;

  @Column({
    comment: '显示状态，是否在侧边栏显示',
  })
  isShow: boolean;

  @Column({ length: 100, comment: '备注' })
  memo: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;
}
