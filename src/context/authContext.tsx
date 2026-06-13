import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User, type AuthState } from '../types/auth';

interface AuthContextType {
  currentUser: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<{
    success: boolean;
    user?: Omit<User, 'password'>;
    error?: string;
  }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    fullName: 'Администратор',
    role: 'admin',
  },
  {
    id: '2',
    username: 'student1',
    password: 'student123',
    fullName: 'Иванов Иван',
    role: 'student',
    groupId: 1,
  },
  {
    id: '3',
    username: 'student2',
    password: 'student123',
    fullName: 'Петрова Мария',
    role: 'student',
    groupId: 2,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    currentUser: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('auth_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        setAuthState({ currentUser: user, isAuthenticated: true });
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const { password: _, ...safeUser } = user;
      setAuthState({ currentUser: safeUser, isAuthenticated: true });
      localStorage.setItem('auth_user', JSON.stringify(safeUser));
      return { success: true, user: safeUser };
    }

    return { success: false, error: 'Неверный логин или пароль' };
  };

  const logout = () => {
    setAuthState({ currentUser: null, isAuthenticated: false });
    localStorage.removeItem('auth_user');
  };

  const value: AuthContextType = {
    currentUser: authState.currentUser,
    isAuthenticated: authState.isAuthenticated,
    isAdmin: authState.currentUser?.role === 'admin',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}