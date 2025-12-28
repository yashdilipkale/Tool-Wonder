import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  loading: boolean;
  session: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

class AuthClient {
  private baseURL = 'http://localhost:3001';

  async signInWithEmail(data: { email: string; password: string }) {
    const response = await fetch(`${this.baseURL}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async signUpWithEmail(data: { name: string; email: string; password: string }) {
    const response = await fetch(`${this.baseURL}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async signInWithSocial(provider: 'google' | 'github') {
    const response = await fetch(`${this.baseURL}/api/auth/sign-in/social`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ provider }),
    });
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    }
    return data;
  }

  async signOut() {
    const response = await fetch(`${this.baseURL}/api/auth/sign-out`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.json();
  }

  async getSession() {
    const response = await fetch(`${this.baseURL}/api/auth/session`, {
      credentials: 'include',
    });
    return response.json();
  }
}

const authClient = new AuthClient();

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const sessionData = await authClient.getSession();
      if (sessionData.user) {
        setUser(sessionData.user);
        setSession(sessionData);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await authClient.signInWithEmail({ email, password });
      if (result.user) {
        setUser(result.user);
        setSession(result);
        return { success: true };
      }
      return { success: false, error: result.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const result = await authClient.signUpWithEmail({ name, email, password });
      if (result.user) {
        setUser(result.user);
        setSession(result);
        return { success: true };
      }
      return { success: false, error: result.error || 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await authClient.signInWithSocial('google');
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  const signInWithGithub = async () => {
    try {
      await authClient.signInWithSocial('github');
    } catch (error) {
      console.error('GitHub sign in error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    signInWithGoogle,
    signInWithGithub,
    loading,
    session,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
