import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, ArrowRight } from 'lucide-react';

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const storedOtp = localStorage.getItem('otp');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    try {
      if (otp !== storedOtp) {
        throw new Error('Invalid OTP');
      }
      
      // If OTP matches, navigate to reset password
      navigate('/reset-password');
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center px-4"
         style={{
           backgroundImage: "linear-gradient(to bottom right, rgba(249, 250, 251, 0.8), rgba(209, 213, 219, 0.8))",
           backgroundSize: "cover"
         }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-base-100 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <div className="text-center">
              <KeyRound className="w-12 h-12 mx-auto mb-4" />
              <h1 className="text-2xl font-bold">Verify OTP</h1>
              <p className="text-sm mt-2 text-blue-100">
                Enter the verification code sent to your email
              </p>
            </div>
          </div>

          <div className="px-8 py-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-base-content mb-1">
                  Verification Code
                </label>
                <motion.input
                  whileFocus={{ scale: 1.005 }}
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-base-100 text-base-content border border-base-content/20 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg shadow-md transition disabled:opacity-50 flex items-center justify-center"
              >
                {isVerifying ? (
                  <span className="inline-flex items-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Verifying...
                  </span>
                ) : (
                  <span className="inline-flex items-center">
                    Verify Code
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                )}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-base-content/70">
              Didn't receive the code?{" "}
              <button className="font-medium text-primary hover:text-primary-focus transition-colors">
                Resend
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


export default OtpVerification;
