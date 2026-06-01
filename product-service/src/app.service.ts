import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateProductDto } from './product.dto';
import { 
  isValidProductName, 
  isValidProductDescription, 
  isValidProductPrice, 
  isValidProductStock 
} from './utils/validation.utils';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  
  // PUBLIC ENDPOINTS LOGIC

  // ambil semua product
  async getAllProducts() {
    return this.prisma.product.findMany({
      include: { category: true }, // Joins the category name
    });
  }

  // ambil 1 product lewat ID nya
  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }
    return product;
  }

  // ambil semua category
  async getAllCategories() {
    return this.prisma.category.findMany();
  }

  // ambil product berdasarkan category
  async getProductsByCategory(categoryId: number) {
    // check apakah category nya exist atau tidak
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found.`);
    }

    return this.prisma.product.findMany({
      where: { category_id: categoryId },
      include: { category: true },
    });
  }

  // ADMIN ONLY ENDPOINTS LOGIC

  //buat product baru
  async createProduct(dto: CreateProductDto) {
    const { name, description, price, stock, image_url, category_id } = dto;

    // validasi input tanpa RegEx
    if (!isValidProductName(name)) {
      throw new BadRequestException('Product name must contain at least 3 words.');
    }
    if (!isValidProductDescription(description)) {
      throw new BadRequestException('Description must be at least 20 characters long.');
    }
    if (!isValidProductPrice(price)) {
      throw new BadRequestException('Price must be a positive integer (minimum 1).');
    }
    if (!isValidProductStock(stock)) {
      throw new BadRequestException('Stock must be an integer between 0 and 999.');
    }

    // cek apakah category ini ada di DB atau tidak
    const category = await this.prisma.category.findUnique({
      where: { id: category_id },
    });
    if (!category) {
      throw new BadRequestException(`Category with ID ${category_id} does not exist.`);
    }

    // create terus save di database
    return this.prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        image_url,
        category_id,
      },
    });
  }

  // update product
  async updateProduct(id: number, dto: CreateProductDto) {
    // cek apakah product ini ada di DB atau tidak
    await this.getProductById(id);

    const { name, description, price, stock, image_url, category_id } = dto;

    // validasi input
    if (!isValidProductName(name)) {
      throw new BadRequestException('Product name must contain at least 3 words.');
    }
    if (!isValidProductDescription(description)) {
      throw new BadRequestException('Description must be at least 20 characters long.');
    }
    if (!isValidProductPrice(price)) {
      throw new BadRequestException('Price must be a positive integer (minimum 1).');
    }
    if (!isValidProductStock(stock)) {
      throw new BadRequestException('Stock must be an integer between 0 and 999.');
    }

    // cek apakah category ini ada di DB atau tidak
    const category = await this.prisma.category.findUnique({
      where: { id: category_id },
    });
    if (!category) {
      throw new BadRequestException(`Category with ID ${category_id} does not exist.`);
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
        image_url,
        category_id,
      },
    });
  }

  // mengurangi product stock
  async reduceStock(id: number, quantity: number) {
    const product = await this.getProductById(id);

    // Pastikan stock masih ada 
    if (product.stock - quantity < 0) {
      throw new BadRequestException(`Insufficient stock for product ID ${id}. Available: ${product.stock}, requested: ${quantity}`);
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        stock: product.stock - quantity,
      },
    });
  }

  // Delete product
  async deleteProduct(id: number) {
    // Ceck prodcut nya ada atau tidak 
    await this.getProductById(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
