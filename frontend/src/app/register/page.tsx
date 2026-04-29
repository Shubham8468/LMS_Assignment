'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/register', { ...formData, role: 'Borrower' });
      toast.success(data.message);
      login(data.token, data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[10%] right-[20%] w-[40%] h-[40%] bg-indigo-600/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-purple-500/20 blur-[100px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl z-10"
      >
        <div className="flex justify-center mb-6">
           <Wallet className="w-12 h-12 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>
          <button 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] mt-4"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-6 text-center text-slate-400">
          Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
