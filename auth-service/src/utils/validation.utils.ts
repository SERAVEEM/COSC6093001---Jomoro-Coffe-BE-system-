// Helper: Checks if a string contains ONLY alphabetical characters (A-Z, a-z)
export function isAlpha(str: string): boolean {
  if (!str || str.length === 0) return false;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    // Uppercase letters are 65-90, Lowercase letters are 97-122
    const isUpper = charCode >= 65 && charCode <= 90;
    const isLower = charCode >= 97 && charCode <= 122;
    if (!isUpper && !isLower) {
      return false;
    }
  }
  return true;
}

// Helper: Checks if an email ends with .com, .net, .org, or .id
export function isValidEmailExtension(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  
  const lowerEmail = email.toLowerCase();
  const endsWithCom = lowerEmail.endsWith('.com');
  const endsWithNet = lowerEmail.endsWith('.net');
  const endsWithOrg = lowerEmail.endsWith('.org');
  const endsWithId = lowerEmail.endsWith('.id');
  
  return endsWithCom || endsWithNet || endsWithOrg || endsWithId;
}

// Helper: Validates password (no space, min 8 chars, min 2 digits)
export function isValidPassword(password: string): boolean {
  if (!password || password.length < 8) return false;
  
  // Check for spaces
  if (password.includes(' ')) return false;

  // Count digit characters (0-9)
  let digitCount = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password[i];
    if (char >= '0' && char <= '9') {
      digitCount++;
    }
  }

  return digitCount >= 2;
}
