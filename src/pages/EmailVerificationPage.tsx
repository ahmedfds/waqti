import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

interface EmailVerificationPageProps {
  setActivePage: (page: string) => void;
}

const EmailVerificationPage: React.FC<EmailVerificationPageProps> = ({ setActivePage }) => {
  const { user } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (verificationCode === '123456') {
        setSuccess(true);
        setTimeout(() => {
          setActivePage('role-selection');
        }, 2000);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');

    try {
      // Simulate resend process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
          <p className="text-gray-600">Your email has been successfully verified. Redirecting...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-xl shadow-md p-8">
          <button
            onClick={() => setActivePage('register')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-[#2E86AB]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
            <p className="text-gray-600">
              We've sent a verification code to{' '}
              <span className="font-medium text-gray-900">{user?.email || 'your email'}</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isVerifying}
              disabled={verificationCode.length !== 6}
            >
              Verify Email
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the code?
            </p>
            {canResend ? (
              <button
                onClick={handleResendCode}
                disabled={isResending}
                className="text-[#2E86AB] hover:text-[#1e5f7a] font-medium text-sm flex items-center gap-2 mx-auto"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Code'
                )}
              </button>
            ) : (
              <p className="text-sm text-gray-500">
                Resend available in {countdown}s
              </p>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo:</strong> Use code <code className="bg-blue-200 px-1 rounded">123456</code> for testing
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;