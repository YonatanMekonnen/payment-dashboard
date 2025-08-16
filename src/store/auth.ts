import { create } from 'zustand';

export interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: async (username: string, password: string) => {
    // Mock authentication - in production this would be a real API call
    if (username === 'admin' && password === 'admin123') {
      const user = {
        id: '1',
        username: 'admin',
        email: 'admin@paymentsco.com'
      };
      const token = 'mock-jwt-token';
      
      set({
        user,
        token,
        isAuthenticated: true
      });
    } else {
      throw new Error('Invalid credentials');
    }
  },
  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  }
}));