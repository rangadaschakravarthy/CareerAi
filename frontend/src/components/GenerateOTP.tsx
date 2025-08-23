// components/GenerateOTP.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GenerateOTP: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await axios.post('http://localhost:5000/send_recovery_email', {
        recipient_email: email,
        OTP,
      });
      localStorage.setItem('reset_email', email);
      localStorage.setItem('otp', OTP);
      navigate('/otp-verify');
    } catch (err: any) {
      setMessage('Failed to send email. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recover Password</h2>
        {message && <p className="text-red-500 text-sm mb-2">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-2 top-2.5 text-gray-400" size={18} />
              <input
                type="email"
                className="w-full pl-8 p-2 border border-gray-300 rounded-md"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateOTP;
