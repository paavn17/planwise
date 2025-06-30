'use client';

import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { doPasswordReset } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await doPasswordReset(email);
      toast.success('Password reset link sent! Check your email.');
      setEmail('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-gray-900 bg-gray-50">
      {/* Soft Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative w-full max-w-md z-10 min-h-[500px]">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-200 min-h-[450px]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Reset Password</h1>
            <p className="text-gray-500">Enter your email to receive reset instructions</p>
          </div>

          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-gray-600 hover:underline cursor-pointer text-sm"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
