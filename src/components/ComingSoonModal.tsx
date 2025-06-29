import React, { useState, useRef, useEffect } from 'react';
import { X, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setIsSubmitting(false);
      setIsSuccess(false);
      setError('');
      
      // Focus email input after modal opens
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Validate email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Save email to Firebase
      await addDoc(collection(db, 'free_trial_waitlist'), {
        email: email.trim().toLowerCase(),
        timestamp: serverTimestamp(),
        source: 'brevedu_plus_page',
        userAgent: navigator.userAgent,
        createdAt: new Date().toISOString()
      });

      console.log('✅ Email added to waitlist:', email.trim());
      setIsSuccess(true);
      
      // Auto-close modal after showing success message
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error adding email to waitlist:', error);
      setError('Something went wrong, try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-[1.6rem] w-full max-w-md shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <h2 id="coming-soon-title" className="text-xl font-bold text-black">
            Coming Soon
          </h2>
          <button
            onClick={onClose}
            className="icon-button icon-button-gray p-2 rounded-[0.8rem]"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            // Success State
            <div className="text-center">
              <div className="w-16 h-16 bg-hazel/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-kelp" />
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">
                Thanks, we'll let you know!
              </h3>
              <p className="text-base text-gray-700">
                You'll be among the first to know when BrevEdu+ launches.
              </p>
            </div>
          ) : (
            // Form State
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-cobalt/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-cobalt" />
                </div>
                <p className="text-base text-gray-700 leading-relaxed">
                  This feature is currently in development. Leave your email and we'll notify you when it's available.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label htmlFor="waitlist-email" className="block text-sm font-medium text-black mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      ref={emailInputRef}
                      type="email"
                      id="waitlist-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-[1.2rem] text-gray-900 placeholder-gray-500 focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 transition-all"
                      placeholder="Enter your email address"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center space-x-2 text-red text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className="w-full bg-cobalt text-white px-6 py-3 rounded-[1.2rem] text-base font-medium hover:bg-[#4a4fd9] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </form>

              {/* Additional Info */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  We'll only use your email to notify you about BrevEdu+ availability.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;