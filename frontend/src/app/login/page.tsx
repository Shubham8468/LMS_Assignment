'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      toast.success(data.message);
      login(data.token, data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-indigo-600/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-teal-500/20 blur-[100px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl z-10"
      >
        <div className="flex justify-center mb-6">
           <Wallet className="w-12 h-12 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-8">Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lms.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] mt-4"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-slate-400">
          Don't have an account? <Link href="/register" className="text-indigo-400 hover:text-indigo-300">Apply Now</Link>
        </p>
      </motion.div>
    </div>
  );
}
