import { Injectable, HttpException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Role } from './entities/role.entity';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: MongoRepository<Role>,
    private readonly permissionService: PermissionService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    // 查询角色名称是否已存在
    const foundRole = await this.roleRepository.findOneBy({
      name: createRoleDto.name,
    });

    if (foundRole) {
      throw new HttpException('角色名称已存在', 200);
    }

    // 根据 permissionIds 获取到对应的 permissions
    const permissions = await this.permissionService.getPermissionsByIds(
      createRoleDto.permissionIds,
    );

    const newRole = new Role();
    newRole.name = createRoleDto.name;
    newRole.desc = createRoleDto.desc;
    newRole.permissions = permissions;
    return await this.roleRepository.save(newRole);
  }

  // 根据 roleIds 查询对应的 Roles
  async getRolesByIds(roleIds: string[]): Promise<Role[]> {
    return this.roleRepository.find({
      where: {
        _id: {
          $in: roleIds.map((id) => new ObjectId(id)),
        },
      },
    });
  }

  async findAll(
    queryInfo: QueryRoleDto,
  ): Promise<{ data: Role[]; total: number }> {
    const { pageNum, pageSize, id, createTime, name } = queryInfo;
    const skip = (pageNum - 1) * pageSize;
    const query: any = {};

    if (id) {
      query._id = new ObjectId(id);
    }

    if (createTime && createTime.startTime && createTime.endTime) {
      query.createTime = {
        $gte: createTime.startTime,
        $lte: createTime.endTime,
      };
    }

    if (name) {
      query.name = name;
    }

    const [data, total] = await this.roleRepository.findAndCount({
      where: query,
      skip,
      take: pageSize,
      order: { createTime: 'DESC' }, // ASC：升序， DESC：降序
    });

    return { data, total };
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
