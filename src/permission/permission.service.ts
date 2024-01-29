import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { ObjectId } from 'mongodb';
import { QueryPermissionDto } from './dto/query-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: MongoRepository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    // 查询权限code是否已存在
    const foundPermission = await this.permissionRepository.findOneBy({
      code: createPermissionDto.code,
    });

    if (foundPermission) {
      throw new HttpException('权限code已存在', 200);
    }

    const permission = new Permission();
    permission.code = createPermissionDto.code;
    permission.desc = createPermissionDto.desc;

    return this.permissionRepository.save(permission);
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
    console.log(queryInfo);

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

    const { code, desc } = updatePermissionDto;
    permission.code = code;
    permission.desc = desc;

    await this.permissionRepository.update(id, permission);

    return permission;
  }

  async remove(id: string) {
    const res = await this.permissionRepository.deleteOne({
      _id: new ObjectId(id),
    });
    return res;
  }
}
