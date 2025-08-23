import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin, GoogleOAuthProvider, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";

const clientId = "980377395210-85l65e0p2e5ijmq8vsgpq50r1qtbmptf.apps.googleusercontent.com";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError("No credential returned from Google.");
      return;
    }

    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate("/");
    } catch (error) {
      console.error("Google Signup error:", error);
      setError("Google Signup failed. Please try again.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen bg-base-100 text-base-content flex items-center justify-center px-4 sm:px-6 lg:px-8 shadow-2xl" >
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-base-100 rounded-2xl overflow-hidden shadow-xl"
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h1 className="text-3xl font-bold">Create Account</h1>
                <p className="text-sm mt-2 text-blue-100">
                  Join us and start your journey
                </p>
              </motion.div>
            </div>

            <div className="px-8 py-8 bg-base-100 text-base-content">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md text-sm"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleRegister} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-base-content mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/60">
                      <User size={18} />
                    </div>
                    <motion.input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      whileFocus={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-full pl-10 pr-4 py-3 bg-base-100 text-base-content border border-base-content/20 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-base-content mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/60">
                      <Mail size={18} />
                    </div>
                    <motion.input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      whileFocus={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-full pl-10 pr-4 py-3 bg-base-100 text-base-content border border-base-content/20 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-base-content mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/60">
                      <Lock size={18} />
                    </div>
                    <motion.input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      whileFocus={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-full pl-10 pr-10 py-3 bg-base-100 text-base-content border border-base-content/20 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      placeholder="••••••••"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/60 hover:text-base-content"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-base-content mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/60">
                      <Lock size={18} />
                    </div>
                    <motion.input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      whileFocus={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-full pl-10 pr-10 py-3 bg-base-100 text-base-content border border-base-content/20 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                      placeholder="••••••••"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/60 hover:text-base-content"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.button>
                  </div>
                </div>

                {/* Register Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg shadow-md transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center justify-center">
                      <svg
                        className="animate-spin mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4zm2 5.3A8 8 0 014 12H0c0 3.1 1.1 5.8 3 7.9l3-2.6z"
                        />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center">
                      <LogIn size={18} className="mr-2" />
                      Create Account
                    </span>
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="mt-8">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-full border-t border-base-content/10"></div>
                  <span className="relative bg-base-100 px-4 text-sm text-base-content/60 z-10">
                    Or continue with
                  </span>
                </div>

                {/* Google Login */}
                <div className="mt-6 flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <GoogleLogin
                      onSuccess={handleGoogleSignup}
                      onError={() => setError("Google signup failed. Please try again.")}
                      theme="outline"
                      shape="rectangular"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Sign In Link */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-center text-sm text-base-content/70"
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary-focus transition-colors"
                >
                  Sign in
                </Link>
              </motion.p>
            </div>
          </motion.div>
          
          {/* Footer credit */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center text-xs text-base-content/50"
          >
            © 2025 Your Brand. All rights reserved.
          </motion.p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;