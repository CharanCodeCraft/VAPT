'use client';
import { useState } from 'react';
import api from '@/lib/api';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const sendOTP = async () => {
    try {
      await api.post('/password/forgot-password', { email });
      alert('OTP sent to your email');
      setStep(2);
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const verifyOTP = async () => {
    try {
      // VULNERABLE: This response can be intercepted and modified
      const response = await api.post('/password/verify-otp', { email, otp });
      
      if (response.data.valid) {
        setStep(3);
      } else {
        alert('Invalid OTP');
      }
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  const resetPassword = async () => {
    try {
      await api.post('/password/reset-password', { email, newPassword });
      alert('Password reset successful');
      window.location.href = '/login';
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-black mb-6">Forgot Password</h1>

        {step === 1 && (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <button onClick={sendOTP} className="w-full bg-blue-600 text-white p-2 rounded">
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <button onClick={verifyOTP} className="w-full bg-blue-600 text-white p-2 rounded">
              Verify OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <button onClick={resetPassword} className="w-full bg-blue-600 text-white p-2 rounded">
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
