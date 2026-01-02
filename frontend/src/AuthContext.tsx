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
  token: string | null;
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
  private baseURL = import.meta.env.DEV ? 'http://localhost:3001' : 'https://backend-pr2u.onrender.com';

  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async signInWithEmail(data: { email: string; password: string }) {
    const response = await fetch(`${this.baseURL}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async signUpWithEmail(data: { name: string; email: string; password: string }) {
    const response = await fetch(`${this.baseURL}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async signInWithSocial(provider: 'google' | 'github') {
    const response = await fetch(`${this.baseURL}/api/auth/sign-in/social`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeaders() },
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
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    return response.json();
  }

  async getSession() {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${this.baseURL}/api/auth/session`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
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
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  useEffect(() => {
    console.log('AuthProvider useEffect running');
    // Check for token in URL params (after OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    console.log('Token from URL:', tokenFromUrl);
    if (tokenFromUrl) {
      localStorage.setItem('authToken', tokenFromUrl);
      setToken(tokenFromUrl);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      console.log('Token stored and URL cleaned');
    }
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const currentToken = localStorage.getItem('authToken');
    console.log('checkAuthStatus called, currentToken:', currentToken);
    if (!currentToken) {
      console.log('No token found, setting loading to false');
      setLoading(false);
      return;
    }

    try {
      console.log('Calling getSession...');
      const sessionData = await authClient.getSession();
      console.log('Session data received:', sessionData);
      // Handle different possible response formats
      let userData = null;
      if (sessionData.user) {
        userData = sessionData.user;
      } else if (sessionData.id && sessionData.email) {
        // Maybe the response is the user object directly
        userData = sessionData;
      }

      if (userData) {
        console.log('User found in session, setting user:', userData);
        setUser(userData);
        setSession(sessionData);
      } else {
        console.log('No user in session data, clearing token');
        // Token invalid, clear it
        localStorage.removeItem('authToken');
        setToken(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('authToken');
      setToken(null);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await authClient.signInWithEmail({ email, password });
      if (result.user && result.session?.token) {
        localStorage.setItem('authToken', result.session.token);
        setToken(result.session.token);
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
      if (result.user && result.session?.token) {
        localStorage.setItem('authToken', result.session.token);
        setToken(result.session.token);
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
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setSession(null);
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
      const response = await authClient.signInWithSocial('github');
      // Handle the OAuth URL redirect
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
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
