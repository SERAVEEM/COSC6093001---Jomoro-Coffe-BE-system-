"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const jwt_1 = require("@nestjs/jwt");
const validation_utils_1 = require("./utils/validation.utils");
let AppService = class AppService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    getHello() {
        return 'Hello World!';
    }
    async register(dto) {
        const { first_name, last_name, email, password, role } = dto;
        if (!(0, validation_utils_1.isAlpha)(first_name)) {
            throw new common_1.BadRequestException('First name must contain only alphabetical letters.');
        }
        if (!(0, validation_utils_1.isAlpha)(last_name)) {
            throw new common_1.BadRequestException('Last name must contain only alphabetical letters.');
        }
        if (!(0, validation_utils_1.isValidEmailExtension)(email)) {
            throw new common_1.BadRequestException('Email must end with .com, .net, .org, or .id.');
        }
        if (!(0, validation_utils_1.isValidPassword)(password)) {
            throw new common_1.BadRequestException('Password must be at least 8 characters long, contain no spaces, and have at least 2 digits.');
        }
        if (!role) {
            throw new common_1.BadRequestException('Role is required.');
        }
        const existingUser = await this.prisma.user.findFirst({
            where: { Email: email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email is already registered.');
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
    async login(dto) {
        const { email, password } = dto;
        const user = await this.prisma.user.findFirst({
            where: { Email: email },
        });
        if (!user || user.password !== password) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        const payload = { id: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found.');
        }
        return {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.Email,
            role: user.role,
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AppService);
//# sourceMappingURL=app.service.js.map