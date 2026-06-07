import { AppService } from './app.service';
import { AddToCartDto, UpdateCartItemDto } from './transaction.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getCart(req: any): Promise<{
        cart_id: number | null;
        items: never[];
        total_price: number;
    } | {
        cart_id: number;
        items: any[];
        total_price: number;
    }>;
    addToCart(req: any, dto: AddToCartDto): Promise<{
        product_id: number;
        quantity: number;
        id: number;
        cart_id: number;
    }>;
    updateCartItem(req: any, productId: number, dto: UpdateCartItemDto): Promise<{
        product_id: number;
        quantity: number;
        id: number;
        cart_id: number;
    }>;
    deleteCartItem(req: any, productId: number): Promise<{
        product_id: number;
        quantity: number;
        id: number;
        cart_id: number;
    }>;
    clearCart(req: any): Promise<{
        message: string;
    }>;
    checkout(req: any, token: string): Promise<{
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
    getOrders(req: any): Promise<({
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
    getOrderById(req: any, orderId: number): Promise<{
        id: number;
        user_id: number;
        created_at: Date;
        details: any[];
    }>;
}
