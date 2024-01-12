import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // 通过 Reflector 获取当前守卫的路由需要校验的角色（自定义元数据）
    // 再从 request 中获取到 user 信息中的角色
    // 比对当前守卫路由的所需角色中是否包含用户的角色
    // 若包含则返回true放行，否则返回false拦截
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('AuthGuard request', roles);

    /* 
      在 node.js 世界中，通常的做法是将授权用户附加到 request 对象。 因此，在我们上面的示例代码中，我们假设 request.user 包含用户实例和允许的角色。
    */
    // const user = request.user;

    /*
      如果它返回 true，请求将被处理。
      如果它返回 false，Nest 将拒绝该请求。
    */
    return true;
  }
}
