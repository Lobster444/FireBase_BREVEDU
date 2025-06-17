import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, register } = useAuth();

  const validateForm = () => {
    if (!email.trim()) {
      throw new Error('Email is required');
    }
    
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    
    if (!password) {
      throw new Error('Password is required');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    if (mode === 'register') {
      if (!name.trim()) {
        throw new Error('Name is required');
      }
      
      if (name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      validateForm();
      
      if (mode === 'register') {
        await register(email.trim(), password, name.trim());
        setSuccess('Account created successfully! Welcome to BrevEdu!');
        // Close modal after successful registration
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        await login(email.trim(), password);
        setSuccess('Welcome back! Signing you in...');
        // Close modal after successful login
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred. Please try again.';
      
      // Handle Firebase Auth errors
      if (err.code) {
        switch (err.code) {
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email address.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'An account with this email already exists.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password is too weak. Please choose a stronger password.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please check your credentials.';
            break;
          default:
            errorMessage = err.message || errorMessage;
        }
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/80 backdrop-blur-ios flex items-center justify-center z-50 p-4">
      <div className="bg-primary border border-neutral-gray/30 rounded-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-gray hover:text-text-light transition-colors z-10"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-accent-yellow rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-text-dark" />
            </div>
          </div>
          <h2 className="text-h2 text-text-light mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join BrevEdu'}
          </h2>
          <p className="text-body text-text-secondary">
            {mode === 'login' 
              ? 'Sign in to continue your learning journey' 
              : 'Create your account to start learning in 5-minute lessons'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Register only) */}
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-small text-text-light mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-gray" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-gray/20 border border-neutral-gray/30 rounded-lg text-text-light placeholder-neutral-gray focus:outline-none focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20"
                  placeholder="Enter your full name"
                  required
                  minLength={2}
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-small text-text-light mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-gray" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-gray/20 border border-neutral-gray/30 rounded-lg text-text-light placeholder-neutral-gray focus:outline-none focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-small text-text-light mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-gray" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-gray/20 border border-neutral-gray/30 rounded-lg text-text-light placeholder-neutral-gray focus:outline-none focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>
            {mode === 'register' && (
              <p className="text-x-small text-neutral-gray mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {/* Confirm Password Field (Register only) */}
          {mode === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-small text-text-light mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-gray" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-gray/20 border border-neutral-gray/30 rounded-lg text-text-light placeholder-neutral-gray focus:outline-none focus:border-accent-yellow focus:ring-2 focus:ring-accent-yellow/20"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-2 text-red-400 bg-red-400/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span className="text-small">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-start space-x-2 text-accent-green bg-accent-green/10 p-3 rounded-lg">
              <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span className="text-small">{success}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-yellow text-text-dark py-3 rounded-lg text-link font-medium hover:bg-accent-green transition-all shadow-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-text-dark/30 border-t-text-dark rounded-full animate-spin"></div>
                <span>Please wait...</span>
              </div>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="text-center mt-6">
          <p className="text-body text-text-secondary">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={switchMode}
              className="text-accent-yellow hover:text-accent-green transition-colors ml-2 underline font-medium"
              disabled={loading}
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Terms & Privacy (Register only) */}
        {mode === 'register' && (
          <div className="text-center mt-4">
            <p className="text-x-small text-neutral-gray">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-accent-yellow hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-accent-yellow hover:underline">Privacy Policy</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;