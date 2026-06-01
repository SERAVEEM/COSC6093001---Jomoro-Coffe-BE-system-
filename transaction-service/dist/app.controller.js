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
const transaction_dto_1 = require("./transaction.dto");
const jwt_auth_guard_1 = require("./jwt-auth-guard");
const customer_guard_1 = require("./customer.guard");
const swagger_1 = require("@nestjs/swagger");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async getCart(req) {
        return this.appService.getCart(req.user.id);
    }
    async addToCart(req, dto) {
        return this.appService.addToCart(req.user.id, dto);
    }
    async updateCartItem(req, productId, dto) {
        return this.appService.updateCartItem(req.user.id, productId, dto);
    }
    async deleteCartItem(req, productId) {
        return this.appService.deleteCartItem(req.user.id, productId);
    }
    async clearCart(req) {
        return this.appService.clearCart(req.user.id);
    }
    async checkout(req, token) {
        return this.appService.checkout(req.user.id, token);
    }
    async getOrders(req) {
        return this.appService.getOrders(req.user.id);
    }
    async getOrderById(req, orderId) {
        return this.appService.getOrderById(req.user.id, orderId);
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
    (0, common_1.Get)('cart'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active cart items and total price' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return cart details.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('cart'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a product to the cart' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item added to cart successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Stock limit exceeded or product already in cart.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, transaction_dto_1.AddToCartDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Post)('cart/:product_id/update'),
    (0, swagger_1.ApiOperation)({ summary: 'Update item quantity in cart' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quantity updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Requested quantity exceeds stock.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found in cart.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('product_id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, transaction_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateCartItem", null);
__decorate([
    (0, common_1.Post)('cart/:product_id/delete'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a specific item from cart' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item removed from cart successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found in cart.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('product_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteCartItem", null);
__decorate([
    (0, common_1.Post)('cart/clear'),
    (0, swagger_1.ApiOperation)({ summary: 'Empty the entire cart' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cart cleared successfully.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "clearCart", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Checkout and create order' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Order created and stock reduced successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Empty cart or insufficient stock.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "checkout", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of past orders.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Post)('orders/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed order details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return order items and total.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Access denied (not your order).' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order not found.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getOrderById", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('Transactions (Customer Only)'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, customer_guard_1.CustomerGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map