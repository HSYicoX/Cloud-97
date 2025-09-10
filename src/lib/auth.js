
// @ts-ignore
export class AuthService {
  static async refreshAccessToken() {
    try {
      // 浏览器会自动带上HttpOnly的refreshToken cookie
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Token refresh failed');
      
      const { accessToken } = await response.json();
      sessionStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch (error) {
      console.error('Refresh token failed:', error);
      throw error;
    }
  }

  static async getAccessToken() {
    let token = sessionStorage.getItem('accessToken');
    
    if (!token) {
      try {
        token = await this.refreshAccessToken();
      } catch (error) {
        return null;
      }
    }
    
    return token;
  }

  static async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      sessionStorage.removeItem('accessToken');
    }
  }

  static async checkAuth() {
    const token = await this.getAccessToken();
    return Boolean(token);
  }
}
