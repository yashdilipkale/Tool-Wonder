import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';

const Login: React.FC = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string; general?: string}>({});
  const [touched, setTouched] = useState<{email?: boolean; password?: boolean}>({});
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    setErrors(prev => ({ ...prev, email: validateEmail(email) }));
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    setErrors(prev => ({ ...prev, password: validatePassword(password) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setErrors({ general: result.error || 'Invalid email or password. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Welcome back to ToolsWonder
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                      errors.email ? 'border-red-500 dark:border-red-500' : 'border-slate-300 dark:border-slate-600'
                    }`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                      errors.password ? 'border-red-500 dark:border-red-500' : 'border-slate-300 dark:border-slate-600'
                    }`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                  />
                  {errors.password && touched.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                  )}
                </div>
              </div>
            </div>

            {errors.general && (
              <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
