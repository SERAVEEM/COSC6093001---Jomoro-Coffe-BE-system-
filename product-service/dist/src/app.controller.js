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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const product_dto_1 = require("./product.dto");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const admin_guard_1 = require("./admin.guard");
const swagger_1 = require("@nestjs/swagger");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async getAllProducts() {
        return this.appService.getAllProducts();
    }
    async getProductById(id) {
        return this.appService.getProductById(id);
    }
    async getAllCategories() {
        return this.appService.getAllCategories();
    }
    async getProductsByCategory(categoryId) {
        return this.appService.getProductsByCategory(categoryId);
    }
    async createProduct(dto) {
        return this.appService.createProduct(dto);
    }
    async updateProduct(id, dto) {
        return this.appService.updateProduct(id, dto);
    }
    async deleteProduct(id) {
        return this.appService.deleteProduct(id);
    }
    async reduceStock(id, dto) {
        return this.appService.reduceStock(id, dto.quantity);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all products.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return product details.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all categories.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)('categories/:categoryId/products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get products by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return products belonging to the category.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found.' }),
    __param(0, (0, common_1.Param)('categoryId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getProductsByCategory", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('admin/products'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new product (Admin Only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Product created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation or Category missing error.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('admin/products/:id/update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a product (Admin Only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('admin/products/:id/delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a product (Admin Only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Product not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('admin/products/:id/reduce'),
    (0, swagger_1.ApiOperation)({ summary: 'Reduce product stock level (Authenticated Only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stock reduced successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Insufficient stock or invalid input.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, product_dto_1.ReduceStockDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "reduceStock", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map