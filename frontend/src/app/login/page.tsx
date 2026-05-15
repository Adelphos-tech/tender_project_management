'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineTruck, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success(t('login.toast.welcome') || 'Welcome back!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 relative z-10">
          
        <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
                <HiOutlineTruck size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">OpsERP</h1>
                <p className="text-sm text-slate-500 mt-1">Enterprise Operations Suite</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="form-label text-slate-600">Email Address</label>
                <div className="relative">
                    <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input pl-11 bg-slate-50 border-slate-200 focus:bg-white"
                        placeholder="Enter your email"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="form-label text-slate-600">Password</label>
                <div className="relative">
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input pl-11 bg-slate-50 border-slate-200 focus:bg-white"
                        placeholder="Enter your password"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full justify-center py-3.5 text-[15px] shadow-lg shadow-blue-500/25 mt-2"
            >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    'Sign In'
                )}
            </button>
        </form>
      </div>
    </div>
  );
}
