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
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/qury-user.dto';

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

  // 分页查询
  async findAll(
    queryInfo: QueryUserDto,
  ): Promise<{ data: User[]; total: number }> {
    const { pageNum, pageSize, username, nickname, tel, email, createTime } =
      queryInfo;

    const skip = (pageNum - 1) * pageSize;

    const query: any = {};

    if (username) {
      query.username = {
        $regex: new RegExp(username, 'i'),
      };
    }

    if (nickname) {
      query.nickname = {
        $regex: new RegExp(nickname, 'i'),
      };
    }

    if (tel) {
      query.tel = tel;
    }

    if (email) {
      query.email = email;
    }

    if (createTime && createTime.startTime && createTime.endTime) {
      query.createTime = {
        $gte: createTime.startTime,
        $lte: createTime.endTime,
      };
    }

    const [data, total] = await this.userRepository.findAndCount({
      where: query,
      skip,
      take: pageSize,
      order: { createTime: 'DESC' }, // ASC：升序， DESC：降序
      select: [
        'id',
        'username',
        'avatar',
        'nickname',
        'tel',
        'email',
        'intro',
        'roles',
        'createTime',
        'updateTime',
      ],
    });

    return { data, total };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id) },
      // relations: ['roles'], // 如果有关联字段
      select: [
        'id',
        'username',
        'avatar',
        'nickname',
        'tel',
        'email',
        'intro',
        'roles',
        'createTime',
        'updateTime',
      ], // select 选项用于指定你想要返回的字段
    });

    return user;
  }

  async update(id: string, updateUserData: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({
      _id: new ObjectId(id),
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    const { nickname, email, tel, avatar, intro } = updateUserData;
    user.nickname = nickname;
    user.email = email;
    user.tel = tel;
    user.avatar = avatar;
    user.intro = intro;
    await this.userRepository.update(id, user);

    delete user.password;
    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
