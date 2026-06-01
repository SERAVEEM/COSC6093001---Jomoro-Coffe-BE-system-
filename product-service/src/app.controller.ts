import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateProductDto, ReduceStockDto } from './product.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminGuard } from './admin.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';


// The customer clicks "Checkout" in their browser. This hits the transaction-service (POST /orders).
// The customer is logged in, so their request header has their JWT token containing role: "Customer".
// The transaction-service forwards this customer's JWT token when it calls the product-service to reduce the stock of the coffee items.
// If the product-service's stock reduction endpoint required the AdminGuard, it would check the token, see role: "Customer", and return 403 Forbidden. The checkout would fail!
// By only using JwtAuthGuard (and leaving out AdminGuard for the stock reduction), we make sure the endpoint is secure (nobody can call it without a login), but we allow both Admins and Customers to trigger it during order processing.

@ApiTags('Products')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // PUBLIC ENDPOINTS

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Return all products.' })
  async getAllProducts() {
    return this.appService.getAllProducts();
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Return product details.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getProductById(id);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories.' })
  async getAllCategories() {
    return this.appService.getAllCategories();
  }

  @Get('categories/:categoryId/products')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({ status: 200, description: 'Return products belonging to the category.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async getProductsByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.appService.getProductsByCategory(categoryId);
  }

  // ADMIN ONLY ENDPOINTS

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Post('admin/products')
  @ApiOperation({ summary: 'Create a new product (Admin Only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation or Category missing error.' })
  async createProduct(@Body() dto: CreateProductDto) {
    return this.appService.createProduct(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Post('admin/products/:id/update')
  @ApiOperation({ summary: 'Update a product (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateProductDto) {
    return this.appService.updateProduct(id, dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @Post('admin/products/:id/delete')
  @ApiOperation({ summary: 'Delete a product (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.appService.deleteProduct(id);
  }

  // ==========================================
  // SEMI-PRIVATE ENDPOINT (Called internally by Transaction checkout)
  // ARCHITECTURAL DETAIL:
  // We protect this endpoint with JwtAuthGuard (must be logged in) but NOT AdminGuard.
  // During checkout, the Transaction Service calls this endpoint on behalf of a Customer.
  // If we applied AdminGuard here, a Customer's transaction checkout would be blocked.
  // ==========================================
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('admin/products/:id/reduce')
  @ApiOperation({ summary: 'Reduce product stock level (Authenticated Only)' })
  @ApiResponse({ status: 200, description: 'Stock reduced successfully.' })
  @ApiResponse({ status: 400, description: 'Insufficient stock or invalid input.' })
  async reduceStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReduceStockDto // ini buat update stock pakai DTO
  ) {
    return this.appService.reduceStock(id, dto.quantity); // buat akses DTO quantity
  }
}
