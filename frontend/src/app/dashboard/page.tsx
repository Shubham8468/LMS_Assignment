'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { LogOut, CheckCircle, XCircle, Search, DollarSign, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OperationsDashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  
  const [loans, setLoans] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  
  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [paymentData, setPaymentData] = useState({ utr: '', amount: '' });

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user?.role === 'Borrower' && user) router.push('/borrower');
    
    if (user && user.role !== 'Borrower') {
      fetchLoans();
    }
  }, [user, loading, router]);

  const fetchLoans = async () => {
    try {
      const { data } = await api.get('/admin/loans');
      setLoans(data.data);
    } catch (err: any) {
      toast.error('Failed to fetch loans');
    } finally {
      setFetching(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/loans/${id}/status`, { status });
      toast.success(`Loan marked as ${status}`);
      fetchLoans();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const recordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/admin/loans/${selectedLoan._id}/payment`, paymentData);
      toast.success('Payment recorded successfully');
      setShowPaymentModal(false);
      setPaymentData({ utr: '', amount: '' });
      fetchLoans();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payment recording failed');
    }
  };

  if (loading || fetching) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500"/></div>;

  return (
    <div className="min-h-screen p-6 relative">
      <nav className="flex justify-between items-center mb-10 glass-panel p-4 rounded-2xl max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
           <h1 className="text-xl font-bold text-gradient">NexusLend Operations</h1>
           <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium text-slate-300 border border-slate-700">Role: {user?.role}</span>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <LogOut className="w-5 h-5"/> Logout
        </button>
      </nav>

      <main className="max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="text-2xl font-bold">Active Applications</h2>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Search UTR, Name..." className="pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500 w-64 text-slate-200" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/80 text-slate-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Borrower Info</th>
                  <th className="px-6 py-4 font-medium">Loan Details</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {loans.map((loan) => (
                  <motion.tr initial={{ opacity:0 }} animate={{ opacity:1 }} key={loan._id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">{loan.borrowerId?.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{loan.borrowerId?.email}</div>
                      <div className="text-xs text-slate-500 mt-1 uppercase">PAN: {loan.borrowerId?.personalDetails?.pan}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-indigo-400">₹{loan.loanAmount.toLocaleString()}</div>
                      <div className="text-xs text-slate-400 mt-1">{loan.tenure} months @ 12% PA</div>
                      <div className="text-xs text-slate-400 mt-1">Paid: <span className="text-teal-400">₹{loan.amountPaid.toLocaleString()}</span> / ₹{loan.totalRepayment.toLocaleString()}</div>
                      {loan.salarySlipUrl && (
                        <a href={loan.salarySlipUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 mt-1 hover:underline block flex items-center gap-1">
                          📄 View Salary Slip
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        loan.status === 'Applied' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                        loan.status === 'Sanctioned' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                        loan.status === 'Disbursed' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                        loan.status === 'Closed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {/* Role Based Actions */}
                      {(user?.role === 'Admin' || user?.role === 'Sales') && loan.status === 'Applied' && (
                         <>
                           <button onClick={() => updateStatus(loan._id, 'Sanctioned')} className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-colors tooltip" title="Approve & Move to Sanctioned">
                             <CheckCircle className="w-5 h-5"/>
                           </button>
                           <button onClick={() => updateStatus(loan._id, 'Rejected')} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors tooltip" title="Reject Application">
                             <XCircle className="w-5 h-5"/>
                           </button>
                         </>
                      )}
                      {(user?.role === 'Admin' || user?.role === 'Sanction') && loan.status === 'Sanctioned' && (
                         <button onClick={() => updateStatus(loan._id, 'Disbursed')} className="px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-sm font-medium rounded-lg transition-colors">
                           Disburse Funds
                         </button>
                      )}
                      {(user?.role === 'Admin' || user?.role === 'Collection') && loan.status === 'Disbursed' && (
                         <button onClick={() => { setSelectedLoan(loan); setShowPaymentModal(true); }} className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-lg transition-colors flex items-center gap-1">
                           <DollarSign className="w-4 h-4" /> Record Payment
                         </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
                
                {loans.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                       No applications found for your module.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
           <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-8 rounded-3xl max-w-md w-full">
             <h3 className="text-2xl font-bold mb-6">Record EMI Payment</h3>
             <form onSubmit={recordPayment} className="space-y-4">
               <div>
                 <label className="block text-sm text-slate-300 mb-1">UTR Number</label>
                 <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white uppercase" value={paymentData.utr} onChange={(e) => setPaymentData({...paymentData, utr: e.target.value})} placeholder="UNIQUE-TXN-ID" />
               </div>
               <div>
                 <label className="block text-sm text-slate-300 mb-1">Amount Received (₹)</label>
                 <input required type="number" max={selectedLoan.totalRepayment - selectedLoan.amountPaid} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" value={paymentData.amount} onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})} placeholder="10000" />
               </div>
               <div className="text-sm text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800">
                 Outstanding Balance: <span className="font-semibold text-white">₹{(selectedLoan.totalRepayment - selectedLoan.amountPaid).toLocaleString()}</span>
               </div>
               <div className="flex gap-4 mt-6">
                 <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors">Cancel</button>
                 <button type="submit" className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 rounded-xl font-medium transition-colors text-white">Record</button>
               </div>
             </form>
           </motion.div>
        </div>
      )}
    </div>
  );
}
