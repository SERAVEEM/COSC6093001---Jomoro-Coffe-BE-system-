export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url?: string;
    category_id: number;
}
export declare class ReduceStockDto {
    quantity: number;
}
