import { PrismaService } from './prisma.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AppService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    getHello(): string;
    register(dto: RegisterDto): Promise<{
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
    getProfile(userId: number): Promise<{
        first_name: string;
        last_name: string;
        email: string;
        role: string;
    }>;
}
