import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { SEED_USERS } from '../data/seedData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  usersList: User[];
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  switchUserRole: (role: UserRole) => void;
  toggleUserStatus: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'freeimagepro_auth_user_v5';
const USERS_STORAGE_KEY = 'freeimagepro_all_users_v5';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usersList, setUsersList] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse users list from localStorage', e);
    }
    return SEED_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse current user from localStorage', e);
    }
    // Starts as null so guests cannot download, share, save, or like without login
    return null;
  });

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
    } catch (e) {
      console.error('Failed to save users list', e);
    }
  }, [usersList]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save current user', e);
    }
  }, [currentUser]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const trimmed = email.trim().toLowerCase();
    
    // Check if entering Administrator credentials
    if (trimmed === 'admin@freeimagepro.com' || trimmed === 'admin') {
      if (password && password !== 'admin123' && password !== 'admin') {
        return { success: false, message: 'Invalid admin password. Default admin password is: admin123' };
      }
      const adminAccount = usersList.find(u => u.role === 'admin') || SEED_USERS[0];
      setCurrentUser(adminAccount);
      return { success: true };
    }

    // Normal User Login
    const found = usersList.find(u => u.email.toLowerCase() === trimmed);

    if (!found) {
      return {
        success: false,
        message: 'No account found with this email. Please click "Join Free" to create an account, or log in with user@freeimagepro.com',
      };
    }

    if (found.status === 'suspended') {
      return { success: false, message: 'This account has been suspended by an administrator.' };
    }

    // If predefined demo user, check password
    if (found.email === 'user@freeimagepro.com' && password && password !== 'user123' && password !== 'user') {
      return { success: false, message: 'Invalid user password. Default password is: user123' };
    }

    // If custom user with password set
    if ((found as any).password && password && (found as any).password !== password) {
      return { success: false, message: 'Incorrect password entered.' };
    }

    setCurrentUser(found);
    return { success: true };
  };

  const register = async (name: string, email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!name.trim() || !trimmedEmail) {
      return { success: false, message: 'Please provide all required fields.' };
    }

    if (trimmedEmail === 'admin@freeimagepro.com') {
      return { success: false, message: 'Cannot register with administrator email address. Please use the login tab.' };
    }

    const existing = usersList.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists. Please log in.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      username: name.trim().toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(Math.random() * 100),
      email: trimmedEmail,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=0f172a,334155,1e293b`,
      bio: 'FreeImage Pro member and visual enthusiast.',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    (newUser as any).password = password;

    setUsersList(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsersList(prev => prev.map(u => (u.id === updated.id ? updated : u)));
  };

  const switchUserRole = (targetRole: UserRole) => {
    if (targetRole === 'admin') {
      const admin = usersList.find(u => u.role === 'admin') || SEED_USERS[0];
      setCurrentUser(admin);
    } else {
      const normalUser = usersList.find(u => u.role === 'user') || SEED_USERS[1];
      setCurrentUser(normalUser);
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsersList(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'suspended' : 'active';
          if (currentUser && currentUser.id === userId) {
            setCurrentUser({ ...currentUser, status: newStatus });
          }
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === 'admin',
        usersList,
        login,
        register,
        logout,
        updateProfile,
        switchUserRole,
        toggleUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
