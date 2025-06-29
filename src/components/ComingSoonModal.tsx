import React, { useState, useRef, useEffect } from 'react';
import { X, Envelope, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button, IconButton } from './Button';

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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-[1.6rem] w-full max-w-md shadow-xl overflow-hidden border border-black/5"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-black/5">
          <h2 id="coming-soon-title" className="text-2xl font-bold text-black">
            Coming Soon
          </h2>
          <IconButton
            icon={X}
            onClick={onClose}
            variant="gray"
            size="md"
            aria-label="Close modal"
          />
        </div>

        {/* Content */}
        <div className="p-8">
          {isSuccess ? (
            // Success State
                <div className="bg-red-50 border border-red-200 rounded-[1.2rem] p-3">
              <div className="w-16 h-16 bg-hazel/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-kelp" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">
                Thanks, we'll let you know!
              </h3>
              <p className="text-base text-gray-700">
                You'll be among the first to know when BrevEdu+ launches.
              </p>
              <div className="text-center">
                <div className="w-12 h-12 bg-cobalt/10 rounded-full flex items-center justify-center mx-auto mb-3 text-cobalt">
                  <Envelope className="h-6 w-6 text-cobalt" />
            <div className="space-y-4">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-cobalt/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <div className="bg-blue-50 border border-blue-200 rounded-[1.2rem] p-3">
                </div>
                <p className="text-base text-gray-700 leading-relaxed">
                  This feature is currently in development. Leave your email and we'll notify you when it's available.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
            <div className={`flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-4 ${
                    Email Address
                  </label>
                  <div className="relative">
                    <Envelope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      ref={emailInputRef}
                      type="email"
                      id="waitlist-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 bg-white border border-gray-300 rounded-[1.2rem] text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 transition-all"
                      placeholder="Enter your email address"
                }
              <div className="bg-blue-50 border border-blue-200 rounded-[1.2rem] p-3 text-blue-900">
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center space-x-2 text-red text-sm">
                    <WarningCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
              <div className={`mt-2 text-center ${isMobile ? 'pb-4' : ''}`}>
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
              <div className="bg-gray-50 rounded-[1.2rem] p-3">
              </form>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-base text-gray-600">
                  We'll only use your email to notify you about BrevEdu+ availability.
                </p>
              </div>
            </div>
          )
          )}
        </div>
      </div>
    </div>
  )
  );
};

export default ComingSoonModal;
                <div className="bg-yellow-50 border border-yellow-200 rounded-[1.2rem] p-3">