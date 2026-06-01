import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger'


export class CreateProductDto {
    @ApiProperty({example: 'tech Coffe Mug', description: 'Product Name(must contain at least 3 words)'})
    name:string;

    @ApiProperty({example: 'keep ur coffe hot with this smart ceramic mug', description: 'product description(must be at least 20 char)'})
    description:string;

    @ApiProperty({example: 150000, description: 'product price (positive integer >=1)'})
    price:number;

    @ApiProperty({example: 100, description: 'product stock (integer between 0 and 999)'})
    stock:number;

    @ApiPropertyOptional({example: 'https://example.com/mug-v2.jpg', description: 'product image url(optional)'})
    image_url?:string;

    @ApiProperty({example:1, description : 'ID of the category this product belong to'})
    category_id:number;
}

export class ReduceStockDto {
    @ApiProperty({example:5, description : 'Quanitity to subtract from stock'})
    quantity : number;
    
}