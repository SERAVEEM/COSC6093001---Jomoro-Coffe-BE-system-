import { PrismaService } from './prisma.service';
import { HttpService } from '@nestjs/axios';
import { AddToCartDto, UpdateCartItemDto } from './transaction.dto';
export declare class AppService {
    private readonly prisma;
    private readonly httpService;
    constructor(prisma: PrismaService, httpService: HttpService);
    getHello(): string;
    getProductFromService(productId: number): Promise<any>;
    reduceProductStock(productId: number, quantity: number, token: string): Promise<any>;
    getCart(userId: number): Promise<{
        cart_id: number | null;
        items: never[];
        total_price: number;
    } | {
        cart_id: number;
        items: any[];
        total_price: number;
    }>;
    addToCart(userId: number, dto: AddToCartDto): Promise<{
        product_id: number;
        quantity: number;
        id: number;
        cart_id: number;
    }>;
    updateCartItem(userId: number, productId: number, dto: UpdateCartItemDto): Promise<{
        product_id: number;
        quantity: number;
        id: number;
        cart_id: number;
    }>;
    deleteCartItem(userId: number, productId: number): Promise<{
        product_id: number;
        quantity: number;
        id: number;
        cart_id: number;
    }>;
    clearCart(userId: number): Promise<{
        message: string;
    }>;
    checkout(userId: number, token: string): Promise<{
        details: {
            product_id: number;
            quantity: number;
            id: number;
            price: number;
            order_id: number;
        }[];
    } & {
        id: number;
        user_id: number;
        created_at: Date;
    }>;
    getOrders(userId: number): Promise<({
        details: {
            product_id: number;
            quantity: number;
            id: number;
            price: number;
            order_id: number;
        }[];
    } & {
        id: number;
        user_id: number;
        created_at: Date;
    })[]>;
    getOrderById(userId: number, orderId: number): Promise<{
        id: number;
        user_id: number;
        created_at: Date;
        details: any[];
    }>;
}
