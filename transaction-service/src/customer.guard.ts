import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";

@Injectable()
export class CustomerGuard implements CanActivate 
{
    canActivate(context: ExecutionContext): boolean 
    {
        const request = context.switchToHttp().getRequest();
        const user = request.user;


        if(!user || user.role !=='Customer')
        {
            throw new ForbiddenException('access denied customer role required!')
        }
    return true;
    }
}