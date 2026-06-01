import { Controller, Get, Post, Body, Param, UseGuards, Request, Headers, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { AddToCartDto, UpdateCartItemDto } from './transaction.dto';
import { JwtAuthGuard } from './jwt-auth-guard';
import { CustomerGuard } from './customer.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Transactions (Customer Only)')
@UseGuards(JwtAuthGuard, CustomerGuard) // Protects all routes in this controller
@ApiBearerAuth() // Shows padlock in Swagger for all routes
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // ==========================================
  // CART ENDPOINTS
  // ==========================================

  @Get('cart')
  @ApiOperation({ summary: 'Get active cart items and total price' })
  @ApiResponse({ status: 200, description: 'Return cart details.' })
  async getCart(@Request() req) {
    return this.appService.getCart(req.user.id);
  }

  @Post('cart')
  @ApiOperation({ summary: 'Add a product to the cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully.' })
  @ApiResponse({ status: 400, description: 'Stock limit exceeded or product already in cart.' })
  async addToCart(@Request() req, @Body() dto: AddToCartDto) {
    return this.appService.addToCart(req.user.id, dto);
  }

  @Post('cart/:product_id/update')
  @ApiOperation({ summary: 'Update item quantity in cart' })
  @ApiResponse({ status: 200, description: 'Quantity updated successfully.' })
  @ApiResponse({ status: 400, description: 'Requested quantity exceeds stock.' })
  @ApiResponse({ status: 404, description: 'Item not found in cart.' })
  async updateCartItem(
    @Request() req,
    @Param('product_id', ParseIntPipe) productId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.appService.updateCartItem(req.user.id, productId, dto);
  }

  @Post('cart/:product_id/delete')
  @ApiOperation({ summary: 'Delete a specific item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found in cart.' })
  async deleteCartItem(
    @Request() req,
    @Param('product_id', ParseIntPipe) productId: number,
  ) {
    return this.appService.deleteCartItem(req.user.id, productId);
  }

  @Post('cart/clear')
  @ApiOperation({ summary: 'Empty the entire cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully.' })
  async clearCart(@Request() req) {
    return this.appService.clearCart(req.user.id);
  }

  // ==========================================
  // ORDER & CHECKOUT ENDPOINTS
  // ==========================================

  @Post('orders')
  @ApiOperation({ summary: 'Checkout and create order' })
  @ApiResponse({ status: 201, description: 'Order created and stock reduced successfully.' })
  @ApiResponse({ status: 400, description: 'Empty cart or insufficient stock.' })
  async checkout(
    @Request() req,
    @Headers('authorization') token: string, // <-- Extract the Bearer JWT token from headers
  ) {
    return this.appService.checkout(req.user.id, token);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get order history' })
  @ApiResponse({ status: 200, description: 'Return list of past orders.' })
  async getOrders(@Request() req) {
    return this.appService.getOrders(req.user.id);
  }

  @Post('orders/:id')
  @ApiOperation({ summary: 'Get detailed order details' })
  @ApiResponse({ status: 200, description: 'Return order items and total.' })
  @ApiResponse({ status: 400, description: 'Access denied (not your order).' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async getOrderById(
    @Request() req,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return this.appService.getOrderById(req.user.id, orderId);
  }
}
