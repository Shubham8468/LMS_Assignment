'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function BorrowerDashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loanStatus, setLoanStatus] = useState<any>(null);
  const [fetchingStatus, setFetchingStatus] = useState(true);
  
  // Step 1: Personal Details
  const [personalDetails, setPersonalDetails] = useState({
    pan: '', dob: '', monthlySalary: '', employmentMode: 'Salaried'
  });
  
  // Step 2: Salary Slip
  const [file, setFile] = useState<File | null>(null);
  const [salarySlipUrl, setSalarySlipUrl] = useState('');
  
  // Step 3: Apply
  const [loanConfig, setLoanConfig] = useState({
    loanAmount: '', tenure: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user?.role !== 'Borrower' && user) router.push('/dashboard');
    
    if (user && user.role === 'Borrower') {
      fetchLoanStatus();
    }
  }, [user, loading, router]);

  const fetchLoanStatus = async () => {
    try {
      const { data } = await api.get('/borrower/loan-status');
      if (data.data) {
        setLoanStatus(data.data);
      }
    } catch (err: any) {
      if (err.response?.status !== 404) {
        toast.error('Failed to fetch loan status');
      }
    } finally {
      setFetchingStatus(false);
    }
  };

  const submitPersonalDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put('/borrower/personal-details', personalDetails);
      toast.success('Personal details saved!');
      setStep(2);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadSlip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a file');
    
    const formData = new FormData();
    formData.append('file', file);
    
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/borrower/upload-salary-slip', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSalarySlipUrl(data.data.salarySlipUrl);
      toast.success('Salary slip uploaded!');
      setStep(3);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/borrower/apply', {
        ...loanConfig,
        salarySlipUrl
      });
      toast.success('Loan application submitted!');
      fetchLoanStatus();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Application rejected');
      if(err.response?.data?.data?.errors) {
         err.response.data.data.errors.forEach((e: string) => toast.error(e));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || fetchingStatus) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500"/></div>;

  return (
    <div className="min-h-screen p-6 relative">
      <nav className="flex justify-between items-center mb-10 glass-panel p-4 rounded-2xl max-w-4xl mx-auto">
        <h1 className="text-xl font-bold text-gradient">NexusLend | Borrower Portal</h1>
        <button onClick={logout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <LogOut className="w-5 h-5"/> Logout
        </button>
      </nav>

      <main className="max-w-4xl mx-auto">
        {loanStatus ? (
           <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="glass-panel p-8 rounded-3xl text-center">
             <div className="flex justify-center mb-6">
                {loanStatus.status === 'Applied' && <Loader2 className="w-16 h-16 text-yellow-400 animate-spin" />}
                {loanStatus.status === 'Sanctioned' && <CheckCircle className="w-16 h-16 text-teal-400" />}
                {loanStatus.status === 'Disbursed' && <CheckCircle className="w-16 h-16 text-indigo-400" />}
                {loanStatus.status === 'Rejected' && <AlertCircle className="w-16 h-16 text-red-400" />}
             </div>
             <h2 className="text-3xl font-bold mb-4">Application Status: <span className="text-white">{loanStatus.status}</span></h2>
             <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto mt-8 p-6 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-slate-400">Loan Amount:</div>
                <div className="font-semibold text-right">₹{loanStatus.loanAmount.toLocaleString()}</div>
                <div className="text-slate-400">Tenure:</div>
                <div className="font-semibold text-right">{loanStatus.tenure} months</div>
                <div className="text-slate-400">Total Repayment:</div>
                <div className="font-semibold text-right text-indigo-400">₹{loanStatus.totalRepayment.toLocaleString()}</div>
                <div className="text-slate-400">Amount Paid:</div>
                <div className="font-semibold text-right text-teal-400">₹{loanStatus.amountPaid.toLocaleString()}</div>
             </div>
             
             {(loanStatus.status === 'Rejected' || loanStatus.status === 'Closed') && (
                <button 
                  onClick={() => { setLoanStatus(null); setStep(1); }} 
                  className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25"
                >
                  Start New Application
                </button>
             )}
           </motion.div>
        ) : (
          <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
             {/* Progress Bar */}
             <div className="flex mb-12 relative">
               <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 -translate-y-1/2 rounded-full"></div>
               <div className="absolute top-1/2 left-0 h-1 bg-indigo-500 -z-10 -translate-y-1/2 transition-all duration-500 rounded-full" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
               
               {['Personal Details', 'Salary Slip', 'Apply'].map((label, i) => (
                 <div key={i} className={`flex-1 text-center font-medium ${step >= i + 1 ? 'text-indigo-400' : 'text-slate-500'}`}>
                   <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 transition-colors ${step >= i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' : 'bg-slate-800'}`}>
                     {i + 1}
                   </div>
                   {label}
                 </div>
               ))}
             </div>

             <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.form key="step1" initial={{ x: 50, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-50, opacity:0 }} onSubmit={submitPersonalDetails} className="space-y-4 max-w-lg mx-auto">
                    <h3 className="text-2xl font-bold mb-6 text-center">Verify Eligibility</h3>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">PAN Card Number</label>
                      <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white uppercase" value={personalDetails.pan} onChange={(e) => setPersonalDetails({...personalDetails, pan: e.target.value})} placeholder="ABCDE1234F" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Date of Birth</label>
                      <input required type="date" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" value={personalDetails.dob} onChange={(e) => setPersonalDetails({...personalDetails, dob: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Monthly Salary (₹)</label>
                      <input required type="number" min="0" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" value={personalDetails.monthlySalary} onChange={(e) => setPersonalDetails({...personalDetails, monthlySalary: e.target.value})} placeholder="50000" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Employment Mode</label>
                      <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" value={personalDetails.employmentMode} onChange={(e) => setPersonalDetails({...personalDetails, employmentMode: e.target.value})}>
                        <option value="Salaried">Salaried</option>
                        <option value="Self-Employed">Self-Employed</option>
                        <option value="Unemployed">Unemployed</option>
                      </select>
                    </div>
                    <button disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-semibold mt-6">{isSubmitting ? 'Saving...' : 'Next Step'}</button>
                  </motion.form>
                )}

                {step === 2 && (
                  <motion.form key="step2" initial={{ x: 50, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-50, opacity:0 }} onSubmit={uploadSlip} className="space-y-4 max-w-lg mx-auto text-center">
                    <h3 className="text-2xl font-bold mb-6">Upload Salary Slip</h3>
                    <div className="border-2 border-dashed border-slate-700 rounded-2xl p-10 hover:border-indigo-500 transition-colors bg-slate-900/50">
                       <input type="file" id="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                       <label htmlFor="file" className="cursor-pointer flex flex-col items-center">
                         <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                         <span className="text-slate-300 font-medium">{file ? file.name : 'Click to select PDF or Image'}</span>
                       </label>
                    </div>
                    <button disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-semibold mt-6">{isSubmitting ? 'Uploading...' : 'Upload & Continue'}</button>
                  </motion.form>
                )}

                {step === 3 && (
                  <motion.form key="step3" initial={{ x: 50, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-50, opacity:0 }} onSubmit={applyLoan} className="space-y-4 max-w-lg mx-auto">
                    <h3 className="text-2xl font-bold mb-6 text-center">Configure Your Loan</h3>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Loan Amount Required (₹)</label>
                      <input required type="number" min="10000" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" value={loanConfig.loanAmount} onChange={(e) => setLoanConfig({...loanConfig, loanAmount: e.target.value})} placeholder="500000" />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Tenure (Months)</label>
                      <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" value={loanConfig.tenure} onChange={(e) => setLoanConfig({...loanConfig, tenure: e.target.value})}>
                        <option value="">Select Tenure</option>
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                        <option value="24">24 Months</option>
                        <option value="36">36 Months</option>
                        <option value="48">48 Months</option>
                      </select>
                    </div>
                    
                    {loanConfig.loanAmount && loanConfig.tenure && (
                      <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <div className="text-sm text-indigo-300 mb-2">Estimated Details (12% PA)</div>
                        <div className="flex justify-between font-semibold">
                          <span>Total Repayment:</span>
                          <span>₹{(Number(loanConfig.loanAmount) + (Number(loanConfig.loanAmount) * 12 * (Number(loanConfig.tenure)/12)) / 100).toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    <button disabled={isSubmitting} className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/25 py-3 rounded-xl font-bold mt-6 text-lg">{isSubmitting ? 'Applying...' : 'Submit Application'}</button>
                  </motion.form>
                )}
             </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
