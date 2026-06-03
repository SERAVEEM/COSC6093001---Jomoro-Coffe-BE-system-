import { AppService } from './app.service';
import { CreateProductDto, ReduceStockDto } from './product.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getAllProducts(): Promise<({
        category: {
            name: string;
            id: number;
        };
    } & {
        description: string;
        name: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
        id: number;
    })[]>;
    getProductById(id: number): Promise<{
        category: {
            name: string;
            id: number;
        };
    } & {
        description: string;
        name: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
        id: number;
    }>;
    getAllCategories(): Promise<{
        name: string;
        id: number;
    }[]>;
    getProductsByCategory(categoryId: number): Promise<({
        category: {
            name: string;
            id: number;
        };
    } & {
        description: string;
        name: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
        id: number;
    })[]>;
    createProduct(dto: CreateProductDto): Promise<{
        description: string;
        name: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
        id: number;
    }>;
    updateProduct(id: number, dto: CreateProductDto): Promise<{
        description: string;
        name: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
        id: number;
    }>;
    deleteProduct(id: number): Promise<{
        description: string;
        name: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
        id: number;
    }>;
    reduceStock(id: number, dto: ReduceStockDto): Promise<{
        description: string;
        name: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
        id: number;
    }>;
}
