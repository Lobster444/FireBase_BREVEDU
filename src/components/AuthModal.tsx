import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

interface InputFieldProps {
  id: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  icon?: React.ReactNode;
  label: string;
  error?: string;
  autoCapitalize?: string;
  'aria-describedby'?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  minLength,
  maxLength,
  icon,
  label,
  error,
  autoCapitalize = "none",
  'aria-describedby': ariaDescribedBy,
}) => {
  const hasError = !!error;
  
  return (
    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:!text-gray-400 peer-hover:!text-gray-400 peer-active:!text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={`peer w-full bg-white border rounded-headspace-lg py-3 sm:py-2 px-4 text-gray-900 font-normal placeholder-gray-400
            transition-[border-color_0.3s_ease-out,box-shadow_0.3s_ease-out]
            hover:border-[#ccc] hover:animate-[breathe_2s_infinite]
            focus:outline-none focus:border-[#002fa7] focus:border-3 focus:animate-[breathe_2s_infinite]
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${hasError 
              ? 'border-red-400 focus:border-red-400 focus:border-3'
              : 'border-[#e0e0e0]'
            }
          `}
          type={type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          style={{
            minHeight: '44px', // Ensure touch target size
            animationTimingFunction: 'ease-in-out'
          }}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

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

  // Sync mode with initialMode when modal opens or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      resetForm();
    }
  }, [initialMode, isOpen]);

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
        setSuccess('Account created successfully! Please check your email and click the verification link before signing in.');
        // Close modal after successful registration
        setTimeout(() => {
          onClose();
        }, 4000); // Longer delay to let user read the verification message
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
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please check your credentials.';
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
          default:
            errorMessage = err.message || errorMessage;
        }
      } else {
        // Handle custom error messages (like email verification)
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
      <div className="bg-white rounded-headspace-xl w-full max-w-md p-padding-large relative max-h-[90vh] overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 icon-button icon-button-gray z-10 p-2 rounded-headspace-md"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,47,167,0.3)] text-white">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {mode === 'login' ? 'Welcome Back' : 'Join BrevEdu'}
          </h2>
          <p className="text-base text-gray-600 leading-relaxed">
            {mode === 'login' 
              ? 'Sign in to continue your learning journey' 
              : 'Create your account to start learning in 5-minute lessons'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-0">
          {/* Name Field (Register only) */}
          {mode === 'register' && (
            <InputField
              id="name"
              type="text"
              value={name}
              onChange={setName}
              placeholder="Enter your full name"
              required
              minLength={2}
              icon={<User className="h-5 w-5" />}
              label="Name"
              autoCapitalize="words"
            />
          )}

          {/* Email Field */}
          <InputField
            id="email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            required
            icon={<Mail className="h-5 w-5" />}
            label="Email Address"
            autoCapitalize="none"
          />

          {/* Password Field */}
          <div className="mb-6">
            <InputField
              id="password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              required
              minLength={6}
              icon={<Lock className="h-5 w-5" />}
              label="Password"
              aria-describedby={mode === 'register' ? 'password-help' : undefined}
            />
            {mode === 'register' && (
              <p id="password-help" className="mt-1 text-sm text-gray-500">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {/* Confirm Password Field (Register only) */}
          {mode === 'register' && (
            <div className="mb-6">
              <InputField
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirm your password"
                required
                minLength={6}
                icon={<Lock className="h-5 w-5" />}
                label="Confirm Password"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-headspace-lg p-4 mb-4">
              <div className="flex items-start space-x-3 text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-headspace-lg p-4 mb-4">
              <div className="flex items-start space-x-3 text-emerald-700">
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{success}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center mt-12">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-6 rounded-headspace-lg font-medium
                transition-[background-color_0.3s_ease-out,transform_0.2s_ease-out,box-shadow_0.3s_ease-out]
                hover:bg-[#0040d1] hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:animate-[breathe_2s_infinite]
                active:bg-[#002080] active:scale-95
                disabled:bg-[#e0e0e0] disabled:text-[#888] disabled:cursor-not-allowed disabled:hover:bg-[#e0e0e0] disabled:hover:shadow-none disabled:active:scale-100 disabled:hover:animate-none
                focus:outline-none focus:ring-2 focus:ring-[rgba(0,47,167,0.5)] focus:ring-offset-2 focus:animate-[breathe_2s_infinite]
                flex items-center justify-center"
              style={{
                minHeight: '44px',
                animationTimingFunction: 'ease-in-out'
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Please wait...</span>
                </div>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* Switch Mode */}
        <div className="text-center mt-6">
          <p className="text-base text-gray-600">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={switchMode}
              disabled={loading}
              className="text-primary hover:text-primary-hover transition-colors ml-2 underline underline-offset-4 font-medium p-1 rounded-headspace-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;