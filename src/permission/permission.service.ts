import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { ObjectId } from 'mongodb';
import { QueryPermissionDto } from './dto/query-permission.dto';
import { QueryTreeDto } from './dto/query-tree-dto';
import { buildTreePlus } from '../utils/tool';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: MongoRepository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const { pid, name, icon, perms, component, menuType, sort, isShow } =
      createPermissionDto;

    // 如果菜单类型为按钮时，权限标识不能重复
    if (menuType === 'F') {
      const foundPerms = await this.permissionRepository.findOneBy({
        perms: createPermissionDto.perms,
      });

      if (foundPerms) {
        throw new BadRequestException('权限标识已存在');
      }
    } else {
      // 查询 name 是否已存在
      const foundName = await this.permissionRepository.findOneBy({
        name: createPermissionDto.name,
      });

      if (foundName) {
        throw new BadRequestException('权限标识已存在');
      }
    }

    const permission = new Permission();
    permission.pid = pid;
    permission.name = name;
    permission.icon = icon;
    permission.perms = perms;
    permission.component = component;
    permission.menuType = menuType;
    permission.sort = sort;
    permission.isShow = isShow;

    return this.permissionRepository.save(permission);
  }

  // 获取菜单权限树
  async getTree(queryInfo: QueryTreeDto): Promise<any[]> {
    const { name, isShow, menuType, createTime } = queryInfo;

    const query: any = {};

    if (name) {
      // 根据名字模糊查询
      query.name = {
        $regex: new RegExp(name, 'i'), //使用了 MongoDB 的 $regex 查询操作符，该操作符使用正则表达式进行匹配
      };
    }

    if (isShow !== undefined) {
      query.isShow = isShow;
    }

    if (menuType) {
      query.menuType = menuType;
    }

    if (createTime && createTime.startTime && createTime.endTime) {
      query.createTime = {
        $gte: new Date(createTime.startTime),
        $lte: new Date(createTime.endTime),
      };
    }

    // 获取所有的权限数据
    const permissionList = await this.permissionRepository.find({
      where: query,
    });

    // 转为树形结构
    const treeList = buildTreePlus(
      permissionList.map((item: Permission) => ({
        ...item,
        id: item.id.toString(),
      })),
    );

    return treeList;
  }

  // 根据 permissionIds 查询对应的 Permissions
  async getPermissionsByIds(permissionIds: string[]): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: {
        _id: {
          $in: permissionIds.map((id) => new ObjectId(id)),
        },
      },
    });
  }

  async findAll(
    queryInfo: QueryPermissionDto,
  ): Promise<{ data: Permission[]; total: number }> {
    const { pageNum, pageSize, id, updateTime, code } = queryInfo;
    // 公式：skip = (当前页码 - 1) * 每页的条数
    const skip = (pageNum - 1) * pageSize;

    const query: any = {};

    if (id) {
      query._id = new ObjectId(id);
    }

    if (updateTime && updateTime.startTime && updateTime.endTime) {
      query.updateTime = {
        $gte: updateTime.startTime,
        $lte: updateTime.endTime,
      };
    }

    if (code) {
      query.code = code;
    }

    const [data, total] = await this.permissionRepository.findAndCount({
      where: query,
      /* 
        skip： 表示要跳过的文档数。例如，如果 skip 为 10，那么查询将从第 11 个文档开始返回结果，跳过前面的 10 个文档。
      */
      skip,
      /* 
        take： 表示要返回的文档数。它类似于 SQL 中的 LIMIT 子句。例如，如果 take 为 5，那么查询将返回 5 个文档。
      */
      take: pageSize,
      order: { createTime: 'DESC' }, // ASC：升序， DESC：降序
    });

    return { data, total };
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepository.findOneBy({
      _id: new ObjectId(id),
    });

    if (!permission) {
      throw new BadRequestException('编辑权限失败，该权限字段不存在');
    }

    const { pid, name, icon, perms, component, menuType, sort, isShow } =
      updatePermissionDto;
    permission.pid = pid;
    permission.name = name;
    permission.icon = icon;
    permission.perms = perms;
    permission.component = component;
    permission.menuType = menuType;
    permission.sort = sort;
    permission.isShow = isShow;

    await this.permissionRepository.update(id, permission);

    return permission;
  }

  async remove(id: string) {
    // 判断是否有子级菜单
    const permissions = await this.permissionRepository.find({
      where: { pid: id },
    });

    if (permissions.length > 0) {
      throw new BadRequestException('删除失败，该权限菜单下面存在子级菜单');
    }

    const res = await this.permissionRepository.deleteOne({
      _id: new ObjectId(id),
    });
    return res;
  }
}
