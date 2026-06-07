"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReduceStockDto = exports.CreateProductDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateProductDto {
    name;
    description;
    price;
    stock;
    image_url;
    category_id;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'tech Coffe Mug', description: 'Product Name(must contain at least 3 words)' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'keep ur coffe hot with this smart ceramic mug', description: 'product description(must be at least 20 char)' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 150000, description: 'product price (positive integer >=1)' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'product stock (integer between 0 and 999)' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/mug-v2.jpg', description: 'product image url(optional)' }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "image_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID of the category this product belong to' }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "category_id", void 0);
class ReduceStockDto {
    quantity;
}
exports.ReduceStockDto = ReduceStockDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5, description: 'Quanitity to subtract from stock' }),
    __metadata("design:type", Number)
], ReduceStockDto.prototype, "quantity", void 0);
//# sourceMappingURL=product.dto.js.map