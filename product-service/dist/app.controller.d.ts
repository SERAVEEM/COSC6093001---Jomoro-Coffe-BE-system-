import { AppService } from './app.service';
import { CreateProductDto, ReduceStockDto } from './product.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getAllProducts(): Promise<({
        category: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        name: string;
        description: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
    })[]>;
    getProductById(id: number): Promise<{
        category: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        name: string;
        description: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
    }>;
    getAllCategories(): Promise<{
        id: number;
        name: string;
    }[]>;
    getProductsByCategory(categoryId: number): Promise<({
        category: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        name: string;
        description: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
    })[]>;
    createProduct(dto: CreateProductDto): Promise<{
        id: number;
        name: string;
        description: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
    }>;
    updateProduct(id: number, dto: CreateProductDto): Promise<{
        id: number;
        name: string;
        description: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
    }>;
    deleteProduct(id: number): Promise<{
        id: number;
        name: string;
        description: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
    }>;
    reduceStock(id: number, dto: ReduceStockDto): Promise<{
        id: number;
        name: string;
        description: string;
        price: number;
        stock: number;
        image_url: string | null;
        category_id: number;
    }>;
}
