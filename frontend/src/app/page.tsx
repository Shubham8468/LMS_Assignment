'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Wallet } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-500/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Nav */}
      <nav className="w-full py-6 px-8 flex justify-between items-center z-10 glass-panel border-x-0 border-t-0">
        <div className="text-2xl font-bold tracking-tighter text-gradient flex items-center gap-2">
          <Wallet className="text-indigo-400" /> NexusLend
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 rounded-full font-medium text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="px-6 py-2 rounded-full font-medium bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95">
            Apply Now
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight max-w-4xl"
        >
          Next-Generation <br/> <span className="text-gradient">Loan Management</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-xl text-slate-400 max-w-2xl"
        >
          Experience lightning-fast approvals with our intelligent Business Rule Engine. Secure, transparent, and seamless lending designed for the future.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex gap-6"
        >
          <Link href="/register" className="group flex items-center gap-2 px-8 py-4 rounded-full font-semibold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-xl hover:shadow-white/10 hover:scale-105">
            Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full"
        >
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
             <div className="p-4 bg-indigo-500/10 rounded-full mb-4">
                <Zap className="w-8 h-8 text-indigo-400" />
             </div>
             <h3 className="text-xl font-bold mb-2">Instant Eligibility</h3>
             <p className="text-slate-400 text-sm">Our automated BRE verifies your eligibility in milliseconds.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
             <div className="p-4 bg-teal-500/10 rounded-full mb-4">
                <ShieldCheck className="w-8 h-8 text-teal-400" />
             </div>
             <h3 className="text-xl font-bold mb-2">Bank-Grade Security</h3>
             <p className="text-slate-400 text-sm">Your data is encrypted and protected with industry standards.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
             <div className="p-4 bg-purple-500/10 rounded-full mb-4">
                <Wallet className="w-8 h-8 text-purple-400" />
             </div>
             <h3 className="text-xl font-bold mb-2">Flexible Repayment</h3>
             <p className="text-slate-400 text-sm">Track your EMI and make payments seamlessly from your dashboard.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
