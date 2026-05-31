import { Injectable, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';
import { isAlpha, isValidEmailExtension, isValidPassword } from './utils/validation.utils';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService, // <-- Inject JWT Service
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async register(dto: RegisterDto) {
    const { first_name, last_name, email, password, role } = dto;

    if (!isAlpha(first_name)) {
      throw new BadRequestException('First name must contain only alphabetical letters.');
    }
    if (!isAlpha(last_name)) {
      throw new BadRequestException('Last name must contain only alphabetical letters.');
    }
    if (!isValidEmailExtension(email)) {
      throw new BadRequestException('Email must end with .com, .net, .org, or .id.');
    }
    if (!isValidPassword(password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters long, contain no spaces, and have at least 2 digits.',
      );
    }
    if (!role) {
      throw new BadRequestException('Role is required.');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { Email: email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const newUser = await this.prisma.user.create({
      data: { first_name, last_name, Email: email, password, role },
    });

    return {
      id: newUser.id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.Email,
      role: newUser.role,
    };
  }

  // --- LOGIN LOGIC ---
  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findFirst({
      where: { Email: email },
    });

    // Check credentials (plain text passwords per requirement)
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Generate JWT access token
    const payload = { id: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // --- GET PROFILE ---
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found.');
    }
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.Email,
      role: user.role,
    };
  }
}
