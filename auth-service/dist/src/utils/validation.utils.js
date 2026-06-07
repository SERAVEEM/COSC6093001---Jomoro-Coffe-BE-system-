"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAlpha = isAlpha;
exports.isValidEmailExtension = isValidEmailExtension;
exports.isValidPassword = isValidPassword;
function isAlpha(str) {
    if (!str || str.length === 0)
        return false;
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        const isUpper = charCode >= 65 && charCode <= 90;
        const isLower = charCode >= 97 && charCode <= 122;
        if (!isUpper && !isLower) {
            return false;
        }
    }
    return true;
}
function isValidEmailExtension(email) {
    if (!email || !email.includes('@'))
        return false;
    const lowerEmail = email.toLowerCase();
    const endsWithCom = lowerEmail.endsWith('.com');
    const endsWithNet = lowerEmail.endsWith('.net');
    const endsWithOrg = lowerEmail.endsWith('.org');
    const endsWithId = lowerEmail.endsWith('.id');
    return endsWithCom || endsWithNet || endsWithOrg || endsWithId;
}
function isValidPassword(password) {
    if (!password || password.length < 8)
        return false;
    if (password.includes(' '))
        return false;
    let digitCount = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password[i];
        if (char >= '0' && char <= '9') {
            digitCount++;
        }
    }
    return digitCount >= 2;
}
//# sourceMappingURL=validation.utils.js.map