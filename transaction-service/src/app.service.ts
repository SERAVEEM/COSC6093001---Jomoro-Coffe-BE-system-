import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { HttpService } from '@nestjs/axios';
import { AddToCartDto, UpdateCartItemDto } from './transaction.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService, // <-- Inject HTTP Service
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  // =========================================================
  // HTTP Helpers: Communicate with the Product Service
  // =========================================================

  // Get product info (name, price, stock) from Product Service
  async getProductFromService(productId: number): Promise<any> {
    const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
    const url = `${productServiceUrl}/products/${productId}`;
    try {
      // Convert RxJS observable response to a standard Promise
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      throw new BadRequestException(`Product ID ${productId} not found or Product Service is down.`);
    }
  }

  // Send request to Product Service to decrease stock when checkout succeeds
  async reduceProductStock(productId: number, quantity: number, token: string): Promise<any> {
    const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
    const url = `${productServiceUrl}/admin/products/${productId}/reduce`;
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          { quantity },
          {
            headers: {
              Authorization: token, // Forward user's token for authorization
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update product stock.';
      throw new BadRequestException(errorMsg);
    }
  }

  // ==========================================
  // CART MANAGEMENT LOGIC
  // ==========================================

  // Retrieve active cart items and fetch product names/prices from Product Service
  async getCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return { cart_id: cart?.id || null, items: [], total_price: 0 };
    }

    // itemsWithDetails stores product details fetched from Product Service
    const itemsWithDetails: any[] = [];
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

  // Add a new product to the cart
  async addToCart(userId: number, dto: AddToCartDto) {
    const { product_id, quantity } = dto;

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0.');
    }

    // Step 1: Check if the product exists and has enough stock
    const product = await this.getProductFromService(product_id);
    if (quantity > product.stock) {
      throw new BadRequestException(`Requested quantity (${quantity}) is more than available stock (${product.stock}).`);
    }

    // Step 2: Retrieve the user's cart or create a new one if it doesn't exist
    let cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { user_id: userId },
      });
    }

    // Step 3: Check if this product is already in the cart (duplicates not allowed)
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cart_id: cart.id,
        product_id,
      },
    });

    if (existingItem) {
      throw new BadRequestException('Product is already in the cart. Update quantity instead.');
    }

    // Step 4: Create and save the new cart item
    return this.prisma.cartItem.create({
      data: {
        cart_id: cart.id,
        product_id,
        quantity,
      },
    });
  }

  // Update cart item quantity
  async updateCartItem(userId: number, productId: number, dto: UpdateCartItemDto) {
    const { quantity } = dto;
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0.');
    }

    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found.');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!cartItem) {
      throw new NotFoundException(`Product ID ${productId} is not in the cart.`);
    }

    // Verify stock availability
    const product = await this.getProductFromService(productId);
    if (quantity > product.stock) {
      throw new BadRequestException(`Cannot update quantity. Requested quantity (${quantity}) exceeds available stock (${product.stock}).`);
    }

    return this.prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });
  }

  // Delete specific item from cart
  async deleteCartItem(userId: number, productId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found.');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!cartItem) {
      throw new NotFoundException(`Product ID ${productId} is not in the cart.`);
    }

    return this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });
  }

  // Clear all items in the cart
  async clearCart(userId: number) {
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

  // ==========================================
  // ORDER & CHECKOUT LOGIC
  // ==========================================

  // Convert cart items into a purchase order
  async checkout(userId: number, token: string) {
    // Step 1: Retrieve cart details
    const cart = await this.prisma.cart.findUnique({
      where: { user_id: userId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty.');
    }

    // Step 2: Validate product availability and prepare items for purchase
    const itemsToBuy: any[] = [];
    for (const item of cart.items) {
      const product = await this.getProductFromService(item.product_id);
      if (item.quantity > product.stock) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
        );
      }
      itemsToBuy.push({
        product_id: item.product_id,
        price: product.price, // Snapshot of the price at checkout
        quantity: item.quantity,
      });
    }

    // Step 3: Save order and order details to database
    const order = await this.prisma.order.create({
      data: {
        user_id: userId,
        details: {
          create: itemsToBuy, // Creates records in OrderDetail table
        },
      },
      include: {
        details: true,
      },
    });

    // Step 4: Deduct stock from Product Service for each item
    for (const item of itemsToBuy) {
      await this.reduceProductStock(item.product_id, item.quantity, token);
    }

    // Step 5: Clear the cart
    await this.clearCart(userId);

    return order;
  }

  // Get order history
  async getOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      include: { details: true },
      orderBy: { created_at: 'desc' },
    });
  }

  // Get details of a specific order
  async getOrderById(userId: number, orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { details: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found.`);
    }

    if (order.user_id !== userId) {
      throw new BadRequestException('You do not have access to this order.');
    }

    // detailsWithNames stores order items combined with product names from Product Service
    const detailsWithNames: any[] = [];
    for (const detail of order.details) {
      let productName = 'Unknown Product';
      try {
        const product = await this.getProductFromService(detail.product_id);
        productName = product.name;
      } catch (err) {
        // Use fallback if Product Service is down or product was deleted
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
}
