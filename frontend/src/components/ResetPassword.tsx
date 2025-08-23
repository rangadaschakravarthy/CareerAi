import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem('reset_email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsResetting(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsResetting(false);
      return;
    }

    try {
      await axios.put('http://localhost:5000/api/reset-password', {
        email,
        newPassword,
      });
      localStorage.removeItem('otp');
      localStorage.removeItem('reset_email');
      navigate('/recovered');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsResetting(false);
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
              <h1 className="text-2xl font-bold">Reset Password</h1>
              <p className="text-sm mt-2 text-blue-100">
                Create a new secure password
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
                <label htmlFor="newPassword" className="block text-sm font-medium text-base-content mb-1">
                  New Password
                </label>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.005 }}
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-base-100 text-base-content border border-base-content/20 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 pr-10"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-base-content mb-1">
                  Confirm Password
                </label>
                <motion.input
                  whileFocus={{ scale: 1.005 }}
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-base-100 text-base-content border border-base-content/20 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isResetting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg shadow-md transition disabled:opacity-50 flex items-center justify-center"
              >
                {isResetting ? (
                  <span className="inline-flex items-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Resetting Password...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;