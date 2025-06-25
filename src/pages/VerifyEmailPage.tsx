import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const oobCode = searchParams.get('oobCode');
      
      if (!oobCode) {
        setStatus('error');
        setErrorMessage('Invalid verification link. Please try registering again.');
        return;
      }

      try {
        // Apply the email verification code
        await applyActionCode(auth, oobCode);
        console.log('✅ Email verified successfully');
        setStatus('success');
        
        // Redirect to home page after showing success message briefly
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } catch (error: any) {
        console.error('❌ Email verification failed:', error);
        setStatus('error');
        
        // Handle specific Firebase errors
        if (error.code === 'auth/invalid-action-code') {
          setErrorMessage('This verification link has expired or has already been used.');
        } else if (error.code === 'auth/expired-action-code') {
          setErrorMessage('This verification link has expired. Please request a new one.');
        } else {
          setErrorMessage('Failed to verify email. Please try again or contact support.');
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-headspace-2xl p-8 max-w-md w-full text-center shadow-lg">
        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verifying Your Email
            </h1>
            <p className="text-lg text-gray-600">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email Verified!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting you to the homepage...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Verification Failed
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {errorMessage}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/', { replace: true })}
                className="w-full bg-primary text-white px-6 py-3 rounded-headspace-lg text-base font-medium hover:bg-primary-hover transition-all"
              >
                Go to Homepage
              </button>
              <button
                onClick={() => navigate('/', { replace: true })}
                className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-headspace-lg text-base font-medium hover:bg-gray-50 transition-all"
              >
                Try Signing In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;