import {
  Injectable,
  HttpException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './entities/user.entity';
import * as crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { RoleService } from '../role/role.service';

function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

@Injectable()
export class UserService {
  private logger = new Logger();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly roleService: RoleService,
  ) {}

  // 注册用户
  async register(user: RegisterDto): Promise<string> {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new BadRequestException('注册失败，用户已存在');
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
  }

  // 用户登录
  async login(user: LoginDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (!foundUser) {
      throw new BadRequestException('登录失败，用户名不存在');
    }

    // 前端需要对密码进行md5加密处理
    if (md5(foundUser.password) !== md5(user.password)) {
      throw new BadRequestException('登录失败，密码错误');
    }

    delete foundUser.password; // 删除密码字段
    return foundUser;
  }

  // 为用户分配角色
  async assignRoles(assignRolesDto: AssignRolesDto) {
    const { userId, roleIds } = assignRolesDto;

    const user = await this.userRepository.findOneBy({
      _id: new ObjectId(userId),
    });

    if (!user) {
      throw new HttpException('用户不存在', 200);
    }

    // 根据 roleIds 获取到对应的 Roles
    const roles = await this.roleService.getRolesByIds(roleIds);

    user.roles = roles;

    return await this.userRepository.update(userId, user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id) },
      // relations: ['roles'], // 如果有关联字段
      select: [
        'id',
        'username',
        'avatar',
        'tel',
        'roles',
        'createTime',
        'updateTime',
      ], // select 选项用于指定你想要返回的字段
    });

    return user;
  }

  update(id: number, updateUserDto: any) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
