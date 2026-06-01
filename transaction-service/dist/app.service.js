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
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let AppService = class AppService {
    prisma;
    httpService;
    constructor(prisma, httpService) {
        this.prisma = prisma;
        this.httpService = httpService;
    }
    getHello() {
        return 'Hello World!';
    }
    async getProductFromService(productId) {
        const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
        const url = `${productServiceUrl}/products/${productId}`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            return response.data;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Product ID ${productId} not found or Product Service is down.`);
        }
    }
    async reduceProductStock(productId, quantity, token) {
        const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
        const url = `${productServiceUrl}/admin/products/${productId}/reduce`;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, { quantity }, {
                headers: {
                    Authorization: token,
                },
            }));
            return response.data;
        }
        catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to update product stock.';
            throw new common_1.BadRequestException(errorMsg);
        }
    }
    async getCart(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: { user_id: userId },
            include: { items: true },
        });
        if (!cart || cart.items.length === 0) {
            return { cart_id: cart?.id || null, items: [], total_price: 0 };
        }
        const itemsWithDetails = [];
        let totalPrice = 0;
        for (const item of cart.items) {
            const product = await this.getProductFromService(item.product_id);
            const subtotal = product.price * item.quantity;
            totalPrice += subtotal;
            itemsWithDetails.push({
                product_id: item.product_id,
                product_name: product.name,
                price: product.price,
                quantity: item.quantity,
                subtotal,
            });
        }
        return {
            cart_id: cart.id,
            items: itemsWithDetails,
            total_price: totalPrice,
        };
    }
    async addToCart(userId, dto) {
        const { product_id, quantity } = dto;
        if (quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be greater than 0.');
        }
        const product = await this.getProductFromService(product_id);
        if (quantity > product.stock) {
            throw new common_1.BadRequestException(`Requested quantity (${quantity}) is more than available stock (${product.stock}).`);
        }
        let cart = await this.prisma.cart.findUnique({
            where: { user_id: userId },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { user_id: userId },
            });
        }
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cart_id: cart.id,
                product_id,
            },
        });
        if (existingItem) {
            throw new common_1.BadRequestException('Product is already in the cart. Update quantity instead.');
        }
        return this.prisma.cartItem.create({
            data: {
                cart_id: cart.id,
                product_id,
                quantity,
            },
        });
    }
    async updateCartItem(userId, productId, dto) {
        const { quantity } = dto;
        if (quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be greater than 0.');
        }
        const cart = await this.prisma.cart.findUnique({
            where: { user_id: userId },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found.');
        }
        const cartItem = await this.prisma.cartItem.findFirst({
            where: { cart_id: cart.id, product_id: productId },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException(`Product ID ${productId} is not in the cart.`);
        }
        const product = await this.getProductFromService(productId);
        if (quantity > product.stock) {
            throw new common_1.BadRequestException(`Cannot update quantity. Requested quantity (${quantity}) exceeds available stock (${product.stock}).`);
        }
        return this.prisma.cartItem.update({
            where: { id: cartItem.id },
            data: { quantity },
        });
    }
    async deleteCartItem(userId, productId) {
        const cart = await this.prisma.cart.findUnique({
            where: { user_id: userId },
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found.');
        }
        const cartItem = await this.prisma.cartItem.findFirst({
            where: { cart_id: cart.id, product_id: productId },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException(`Product ID ${productId} is not in the cart.`);
        }
        return this.prisma.cartItem.delete({
            where: { id: cartItem.id },
        });
    }
    async clearCart(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: { user_id: userId },
        });
        if (cart) {
            await this.prisma.cartItem.deleteMany({
                where: { cart_id: cart.id },
            });
        }
        return { message: 'Cart cleared successfully.' };
    }
    async checkout(userId, token) {
        const cart = await this.prisma.cart.findUnique({
            where: { user_id: userId },
            include: { items: true },
        });
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Your cart is empty.');
        }
        const itemsToBuy = [];
        for (const item of cart.items) {
            const product = await this.getProductFromService(item.product_id);
            if (item.quantity > product.stock) {
                throw new common_1.BadRequestException(`Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`);
            }
            itemsToBuy.push({
                product_id: item.product_id,
                price: product.price,
                quantity: item.quantity,
            });
        }
        const order = await this.prisma.order.create({
            data: {
                user_id: userId,
                details: {
                    create: itemsToBuy,
                },
            },
            include: {
                details: true,
            },
        });
        for (const item of itemsToBuy) {
            await this.reduceProductStock(item.product_id, item.quantity, token);
        }
        await this.clearCart(userId);
        return order;
    }
    async getOrders(userId) {
        return this.prisma.order.findMany({
            where: { user_id: userId },
            include: { details: true },
            orderBy: { created_at: 'desc' },
        });
    }
    async getOrderById(userId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { details: true },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${orderId} not found.`);
        }
        if (order.user_id !== userId) {
            throw new common_1.BadRequestException('You do not have access to this order.');
        }
        const detailsWithNames = [];
        for (const detail of order.details) {
            let productName = 'Unknown Product';
            try {
                const product = await this.getProductFromService(detail.product_id);
                productName = product.name;
            }
            catch (err) {
            }
            detailsWithNames.push({
                id: detail.id,
                product_id: detail.product_id,
                product_name: productName,
                price: detail.price,
                quantity: detail.quantity,
                subtotal: detail.price * detail.quantity,
            });
        }
        return {
            id: order.id,
            user_id: order.user_id,
            created_at: order.created_at,
            details: detailsWithNames,
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        axios_1.HttpService])
], AppService);
//# sourceMappingURL=app.service.js.map