import { AppService } from './app.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    register(registerDto: RegisterDto): Promise<{
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    getProfile(req: any): Promise<{
        first_name: string;
        last_name: string;
        email: string;
        role: string;
    }>;
}
