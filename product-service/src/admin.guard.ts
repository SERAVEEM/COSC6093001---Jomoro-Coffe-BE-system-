import {Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";


@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext):boolean  {
        const request = context.switchToHttp().getRequest();
        const user = request.user; //ini kan ada dari jwt.strategy.ts
        //verif role nya admin
        if(!user || user.role !== 'Admin'){
            throw new ForbiddenException('Access denied. Admin role required!');
        }
    return true;
    }
}