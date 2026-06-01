import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request (validation error).' })
  @ApiResponse({ status: 409, description: 'Conflict (email already exists).' })
  async register(@Body() registerDto: RegisterDto) {
    return this.appService.register(registerDto);
  }

  // POST /auth/login
  @Post('auth/login')
  @ApiOperation({ summary: 'Login user and get JWT' })
  @ApiResponse({ status: 200, description: 'JWT token returned successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  async login(@Body() loginDto: LoginDto) {
    return this.appService.login(loginDto);
  }

  // GET /profiles (JWT Protected)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // Displays lock icon in Swagger
  @Get('profiles')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@Request() req) {
    // req.user contains the payload validated in JwtStrategy
    return this.appService.getProfile(req.user.id);
  }
}
