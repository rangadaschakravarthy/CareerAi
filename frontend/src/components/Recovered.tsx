// components/Recovered.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Recovered: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4 text-green-600">Password Reset Successful</h2>
        <p className="mb-4">You can now login with your new password.</p>
        <Link
          to="/login"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Recovered;
