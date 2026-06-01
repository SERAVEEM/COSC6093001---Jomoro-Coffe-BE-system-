"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidProductName = isValidProductName;
exports.isValidProductDescription = isValidProductDescription;
exports.isValidProductPrice = isValidProductPrice;
exports.isValidProductStock = isValidProductStock;
function isValidProductName(name) {
    if (!name)
        return false;
    const words = name.trim().split(' ').filter(word => word.length > 0);
    return words.length >= 3;
}
function isValidProductDescription(description) {
    if (!description)
        return false;
    return description.length >= 20;
}
function isValidProductPrice(price) {
    if (!price)
        return false;
    const num = Number(price);
    return !isNaN(num) && Number.isInteger(num) && num >= 1;
}
function isValidProductStock(stock) {
    if (stock == null || stock == undefined)
        return false;
    const num = Number(stock);
    return !isNaN(num) && Number.isInteger(num) && num >= 0 && num <= 999;
}
//# sourceMappingURL=validation.utils.js.map