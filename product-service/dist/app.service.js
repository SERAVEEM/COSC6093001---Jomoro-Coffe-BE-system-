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
const validation_utils_1 = require("./utils/validation.utils");
let AppService = class AppService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getHello() {
        return 'Hello World!';
    }
    async getAllProducts() {
        return this.prisma.product.findMany({
            include: { category: true },
        });
    }
    async getProductById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found.`);
        }
        return product;
    }
    async getAllCategories() {
        return this.prisma.category.findMany();
    }
    async getProductsByCategory(categoryId) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${categoryId} not found.`);
        }
        return this.prisma.product.findMany({
            where: { category_id: categoryId },
            include: { category: true },
        });
    }
    async createProduct(dto) {
        const { name, description, price, stock, image_url, category_id } = dto;
        if (!(0, validation_utils_1.isValidProductName)(name)) {
            throw new common_1.BadRequestException('Product name must contain at least 3 words.');
        }
        if (!(0, validation_utils_1.isValidProductDescription)(description)) {
            throw new common_1.BadRequestException('Description must be at least 20 characters long.');
        }
        if (!(0, validation_utils_1.isValidProductPrice)(price)) {
            throw new common_1.BadRequestException('Price must be a positive integer (minimum 1).');
        }
        if (!(0, validation_utils_1.isValidProductStock)(stock)) {
            throw new common_1.BadRequestException('Stock must be an integer between 0 and 999.');
        }
        const category = await this.prisma.category.findUnique({
            where: { id: category_id },
        });
        if (!category) {
            throw new common_1.BadRequestException(`Category with ID ${category_id} does not exist.`);
        }
        return this.prisma.product.create({
            data: {
                name,
                description,
                price,
                stock,
                image_url,
                category_id,
            },
        });
    }
    async updateProduct(id, dto) {
        await this.getProductById(id);
        const { name, description, price, stock, image_url, category_id } = dto;
        if (!(0, validation_utils_1.isValidProductName)(name)) {
            throw new common_1.BadRequestException('Product name must contain at least 3 words.');
        }
        if (!(0, validation_utils_1.isValidProductDescription)(description)) {
            throw new common_1.BadRequestException('Description must be at least 20 characters long.');
        }
        if (!(0, validation_utils_1.isValidProductPrice)(price)) {
            throw new common_1.BadRequestException('Price must be a positive integer (minimum 1).');
        }
        if (!(0, validation_utils_1.isValidProductStock)(stock)) {
            throw new common_1.BadRequestException('Stock must be an integer between 0 and 999.');
        }
        const category = await this.prisma.category.findUnique({
            where: { id: category_id },
        });
        if (!category) {
            throw new common_1.BadRequestException(`Category with ID ${category_id} does not exist.`);
        }
        return this.prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                stock,
                image_url,
                category_id,
            },
        });
    }
    async reduceStock(id, quantity) {
        const product = await this.getProductById(id);
        if (product.stock - quantity < 0) {
            throw new common_1.BadRequestException(`Insufficient stock for product ID ${id}. Available: ${product.stock}, requested: ${quantity}`);
        }
        return this.prisma.product.update({
            where: { id },
            data: {
                stock: product.stock - quantity,
            },
        });
    }
    async deleteProduct(id) {
        await this.getProductById(id);
        return this.prisma.product.delete({
            where: { id },
        });
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppService);
//# sourceMappingURL=app.service.js.map