// JWT Token utilities

export interface JWTPayload {
  sub?: string; // User ID
  email?: string;
  given_name?: string; // First name
  family_name?: string; // Last name
  name?: string;
  role?: string | string[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    if (!token) return null;
    
    // JWT consists of 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64
    const decoded = atob(paddedPayload);
    
    return JSON.parse(decoded);
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
};

export const extractUserFromToken = (token: string) => {
  const payload = decodeJWT(token);
  if (!payload) return null;
  
  return {
    id: payload.sub || payload.id || '',
    email: payload.email || '',
    firstName: payload.given_name || payload.firstName || '',
    lastName: payload.family_name || payload.lastName || '',
    name: payload.name || '',
    roles: Array.isArray(payload.role) ? payload.role : payload.role ? [payload.role] : [],
    // Backend'deki diğer alanlar için token'da yoksa undefined döner
    phoneNumber: payload.phoneNumber,
    dateOfBirth: payload.dateOfBirth,
    gender: payload.gender,
    emailConfirmed: payload.emailConfirmed,
    createdDate: payload.createdDate
  };
};

export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) return true;
  
  return Date.now() >= payload.exp * 1000;
};
