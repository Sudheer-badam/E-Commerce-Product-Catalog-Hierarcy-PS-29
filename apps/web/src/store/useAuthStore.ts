import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'shopsmart-auth',
    }
  )
);
