'use client'
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@/src/app/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - em produção, isso viria do backend
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@mesa.com': {
    password: 'admin123',
    user: {
      id: '1',
      nome: 'Administrador',
      email: 'admin@mesa.com',
      role: 'admin',
    },
  },
  'garcom@mesa.com': {
    password: 'garcom123',
    user: {
      id: '2',
      nome: 'João Garçom',
      email: 'garcom@mesa.com',
      role: 'garcom',
    },
  },
  'cliente@mesa.com': {
    password: 'cliente123',
    user: {
      id: '3',
      nome: 'Maria Cliente',
      email: 'cliente@mesa.com',
      role: 'cliente',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    // Simular chamada à API
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockUser = mockUsers[email];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user);
      localStorage.setItem('user', JSON.stringify(mockUser.user));
      return mockUser.user;
    } else {
      throw new Error('Credenciais inválidas');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
