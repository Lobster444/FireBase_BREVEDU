import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get oobCode from URL parameters
        let oobCode = searchParams.get('oobCode');
        
        // Fallback: check hash fragment for oobCode (some email clients may modify URLs)
        if (!oobCode) {
          const hash = window.location.hash;
          const hashParams = new URLSearchParams(hash.substring(1));
          oobCode = hashParams.get('oobCode');
        }
        
        if (!oobCode) {
          setStatus('error');
          setMessage('Invalid verification link. Please check your email for a new verification link.');
          return;
        }

        // Apply the verification code
        await applyActionCode(auth, oobCode);
        
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        
        // Redirect to courses page after 3 seconds
        setTimeout(() => {
          navigate('/courses');
        }, 3000);
        
      } catch (error: any) {
        console.error('Email verification error:', error);
        setStatus('error');
        
        if (error.code === 'auth/invalid-action-code') {
          setMessage('This verification link has expired or has already been used.');
        } else if (error.code === 'auth/expired-action-code') {
          setMessage('This verification link has expired. Please request a new one.');
        } else {
          setMessage('Failed to verify email. Please try again or contact support.');
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-headspace-2xl shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 text-[#FF7A59] mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h1>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting you to courses...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <button
                onClick={() => navigate('/')}
                className="bg-[#FF7A59] text-white px-6 py-3 rounded-headspace-lg font-medium hover:bg-[#FF8A6B] transition-all"
              >
                Go to Homepage
              </button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VerifyEmailPage;