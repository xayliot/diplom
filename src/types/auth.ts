export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
  groupId?: number;
}

export interface AuthState {
  currentUser: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
}