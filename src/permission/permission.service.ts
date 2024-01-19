import { Injectable, HttpException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { ObjectId } from 'mongodb';

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

  findAll() {
    return `This action returns all permission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
