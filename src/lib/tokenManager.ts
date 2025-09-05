import { jwtDecode } from "jwt-decode";
// JWT Token Manager for handling access and refresh tokens
import { AuthResponse, RefreshTokenResponse } from "@/Types";
import { api } from "./apiClient";
import { AUTH_ENDPOINTS } from "./constants";

export interface TokenData {
  accessToken: string;
  refreshToken: string | null; // Make refreshToken optional
  expiration: string;
  tokenType: string;
}

class JWTTokenManager {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly TOKEN_EXPIRATION_KEY = 'tokenExpiration';
  private readonly TOKEN_TYPE_KEY = 'tokenType';
  
  private refreshPromise: Promise<boolean> | null = null;

  /**
   * Store tokens in localStorage
   */
  setTokens(tokenData: TokenData): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokenData.accessToken);
    if (tokenData.refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokenData.refreshToken);
    } else {
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
    localStorage.setItem(this.TOKEN_EXPIRATION_KEY, tokenData.expiration);
    localStorage.setItem(this.TOKEN_TYPE_KEY, tokenData.tokenType || 'Bearer');
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get user ID from access token
   */
  getUserIdFromToken(): string | null {
    const token = this.getAccessToken();
    console.log("Token in getUserIdFromToken:", token);
    if (!token) return null;
    try {
      const decoded: { sub: string } = jwtDecode(token);
      console.log("Decoded token:", decoded);
      console.log("Extracted userId:", decoded.sub);
      return decoded.sub;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }

  /**
   * Get token expiration date
   */
  getTokenExpiration(): Date | null {
    if (typeof window === 'undefined') return null;
    const expiration = localStorage.getItem(this.TOKEN_EXPIRATION_KEY);
    return expiration ? new Date(expiration) : null;
  }

  /**
   * Check if access token is expired
   */
  isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    if (!expiration) return true;
    
    // Add 1 minute buffer to avoid edge cases
    const now = new Date();
    const bufferTime = 60 * 1000; // 1 minute in milliseconds
    
    return now.getTime() > (expiration.getTime() - bufferTime);
  }

  /**
   * Check if user has valid tokens (access or refresh)
   */
  hasValidTokens(): boolean {
    const accessToken = this.getAccessToken();
    
    if (!accessToken) return false;
    
    // If access token is not expired, we're good
    if (!this.isTokenExpired()) return true;
    
    // If access token is expired, we need refresh token to refresh
    return !!this.getRefreshToken();
  }

  /**
   * Get valid access token (refresh if needed)
   */
  async getValidAccessToken(): Promise<string | null> {
    const accessToken = this.getAccessToken();
    
    // If token is not expired, return it
    if (accessToken && !this.isTokenExpired()) {
      return accessToken;
    }

    // If token is expired and we have refresh token, try to refresh
    if (this.getRefreshToken()) {
      const refreshSuccess = await this.refreshAccessToken();
      if (refreshSuccess) {
        return this.getAccessToken();
      }
    }

    return null;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return await this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;
    
    return result;
  }

  private async performTokenRefresh(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        console.warn('🔄 No refresh token available, cannot refresh');
        this.clearTokens();
        return false;
      }

      console.log('🔄 Refreshing access token...');

      // Call refresh endpoint
      const response = await api.post<RefreshTokenResponse>(
        AUTH_ENDPOINTS.refresh,
        { refreshToken }
      );

      if (response.data.success && response.data.token) {
        const { accessToken, refreshToken: newRefreshToken, expiration, tokenType } = response.data.token;
        
        // Store new tokens
        this.setTokens({
          accessToken,
          refreshToken: newRefreshToken || null, // newRefreshToken might be undefined
          expiration,
          tokenType: tokenType || 'Bearer'
        });

        console.log('✅ Token refreshed successfully');
        return true;
      } else {
        console.warn('⚠️ Token refresh failed:', response.data.message);
        this.clearTokens();
        return false;
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      this.clearTokens();
      return false;
    }
  }

  /**
   * Clear all tokens from localStorage
   */
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRATION_KEY);
    localStorage.removeItem(this.TOKEN_TYPE_KEY);
  }

  /**
   * Initialize tokens from auth response
   */
  initializeFromAuthResponse(authResponse: AuthResponse): boolean {
    if (!authResponse.success || !authResponse.token) {
      return false;
    }

    const { accessToken, refreshToken, expiration, tokenType } = authResponse.token;

    if (!accessToken) {
      console.error('❌ Access token missing in auth response');
      return false;
    }

    this.setTokens({
      accessToken,
      refreshToken: refreshToken || null, // refreshToken might be undefined
      expiration,
      tokenType: tokenType || 'Bearer'
    });

    return true;
  }

  /**
   * Get token info for debugging
   */
  getTokenInfo(): {
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    isExpired: boolean;
    expiresAt: string | null;
    tokenType: string | null;
  } {
    return {
      hasAccessToken: !!this.getAccessToken(),
      hasRefreshToken: !!this.getRefreshToken(),
      isExpired: this.isTokenExpired(),
      expiresAt: this.getTokenExpiration()?.toISOString() || null,
      tokenType: typeof window !== 'undefined' ? localStorage.getItem(this.TOKEN_TYPE_KEY) : null
    };
  }
}

// Export singleton instance
export const tokenManager = new JWTTokenManager();
