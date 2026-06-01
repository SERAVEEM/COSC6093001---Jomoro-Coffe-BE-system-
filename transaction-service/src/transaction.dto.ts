import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: 1, description: 'ID of the product to add to the cart' })
  product_id: number;

  @ApiProperty({ example: 2, description: 'Quantity of the product' })
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 3, description: 'Updated quantity of the product' })
  quantity: number;
}
