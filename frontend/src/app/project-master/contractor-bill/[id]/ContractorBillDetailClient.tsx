'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  HiOutlineArrowLeft,
  HiOutlineTrash,
  HiOutlineCash,
  HiOutlineDocumentText,
  HiOutlineMap
} from 'react-icons/hi';

interface ContractorBillDetailClientProps {
  id: string;
}

export default function ContractorBillDetailClient({ id }: ContractorBillDetailClientProps) {
  const router = useRouter();
  const { hasPermission } = useAuth();

  const [bill] = useState({
    _id: id,
    projectName: 'Office Building',
    contractorName: 'BuildWell Pvt Ltd',
    totalContractValue: 10000000,
    paperBillAmount: 4000000,
    paymentRequested: 3000000,
    amountPaid: 2500000,
    paymentStatus: 'partial',
    status: 'approved',
    paperBillNo: 'BILL-2024-001',
    paperBillDate: '2024-01-10',
    onSiteCompletionPct: 45,
    onSiteMeasuredBy: 'Site Engineer',
    onSiteMeasurementDate: '2024-01-08',
    varianceNote: '',
  });

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payAmount, setPayAmount] = useState('');

  const handleDelete = async () => {
    if (!hasPermission('contractorBill', 'delete')) {
      toast.error('No permission to delete');
      return;
    }
    if (!window.confirm('Delete this bill?')) return;
    toast.success('Bill deleted');
    router.push('/project-master/contractor-bill');
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Payment recorded!');
    setShowPaymentForm(false);
    setPayAmount('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const paperPct = bill.totalContractValue > 0 ? (bill.paperBillAmount / bill.totalContractValue) * 100 : 0;
  const variance = bill.onSiteCompletionPct - paperPct;
  const absVariance = Math.abs(variance);
  const isHighVariance = absVariance > 15 && bill.totalContractValue > 0;

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-12 space-y-6">

      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/project-master/contractor-bill"
            className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white shadow-sm"
          >
            <HiOutlineArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{bill.projectName}</h1>
            <p className="text-sm font-medium text-slate-500">
              {bill.contractorName} • {bill.paperBillNo || 'No Bill #'}
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            ['approved', 'paid'].includes(bill.status) ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
            bill.status === 'disputed' ? 'bg-red-50 text-red-600 border-red-200' :
            'bg-blue-50 text-blue-600 border-blue-200'
          }`}>
            {bill.status}
          </span>
          {hasPermission('contractorBill', 'delete') && (
            <button onClick={handleDelete} className="btn btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200 ml-2">
              <HiOutlineTrash size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="text-center bg-slate-50 border border-slate-200 p-4 rounded-xl mb-6">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total Project Contract Value</p>
        <p className="text-2xl font-black text-slate-800">{formatCurrency(bill.totalContractValue)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 shadow-sm border-t-4 border-blue-400">
          <h3 className="text-base font-bold text-blue-800 flex items-center gap-2 mb-6 pb-4 border-b border-blue-100">
            <HiOutlineDocumentText size={24} /> On-Paper Bill
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase">Amount Billed</span>
              <div className="text-right">
                <span className="block text-lg font-bold text-slate-800">{formatCurrency(bill.paperBillAmount)}</span>
                <span className="text-xs text-slate-400">{Math.round(paperPct)}% of total contract</span>
              </div>
            </div>
            <div className="flex justify-between flex-col bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
              <span className="text-xs font-bold text-emerald-700 uppercase mb-2">Payment Ask (Now)</span>
              <span className="block text-3xl font-black text-emerald-600">{formatCurrency(bill.paymentRequested)}</span>
              <span className="text-xs font-medium text-emerald-500 mt-1">Status: <strong className="uppercase">{bill.paymentStatus}</strong></span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Bill Date</p>
                <p className="text-sm font-semibold text-slate-700">{format(new Date(bill.paperBillDate), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Amount Released</p>
                <p className="text-sm font-bold text-emerald-600">{formatCurrency(bill.amountPaid)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 shadow-sm border-t-4 border-indigo-400">
          <h3 className="text-base font-bold text-indigo-800 flex items-center gap-2 mb-6 pb-4 border-b border-indigo-100">
            <HiOutlineMap size={24} /> On-Site Progress
          </h3>

          <div className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Physical Work Completed</span>
              <span className="block text-4xl font-black text-indigo-600">{bill.onSiteCompletionPct}%</span>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-4 overflow-hidden max-w-xs mx-auto">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${bill.onSiteCompletionPct}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Measured By</p>
                <p className="text-sm font-semibold text-slate-700">{bill.onSiteMeasuredBy || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Measured On</p>
                <p className="text-sm font-semibold text-slate-700">{bill.onSiteMeasurementDate ? format(new Date(bill.onSiteMeasurementDate), 'MMM dd, yyyy') : 'N/A'}</p>
              </div>
            </div>

            {bill.varianceNote && (
              <div className="mt-4 p-3 bg-white border border-slate-200 rounded-lg">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Variance Details</p>
                <p className="text-sm text-slate-600 italic">&quot;{bill.varianceNote}&quot;</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`card p-6 mt-6 shadow-sm border ${isHighVariance ? 'border-red-200 bg-red-50/20' : 'border-slate-100'}`}>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Dual Track Variance Analysis</h3>

        <div className="relative pt-6 pb-2">
          <div className="absolute top-0 left-0 text-xs font-bold text-blue-600">Paper Billed: {Math.round(paperPct)}%</div>
          <div className="w-full bg-slate-100 rounded-full h-4 mb-6 relative z-10 shadow-inner">
            <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${Math.min(paperPct, 100)}%` }}></div>
          </div>

          <div className="absolute bottom-6 left-0 text-xs font-bold text-indigo-600">Actual Progress: {bill.onSiteCompletionPct}%</div>
          <div className="w-full bg-slate-100 rounded-full h-4 relative z-10 shadow-inner">
            <div className="bg-indigo-500 h-4 rounded-full" style={{ width: `${bill.onSiteCompletionPct}%` }}></div>
          </div>

          {isHighVariance && (
            <div className="mt-4 text-center">
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                Warning: {absVariance.toFixed(1)}% Variance detected between paper claim and physical reality.
              </span>
            </div>
          )}
        </div>
      </div>

      {bill.paymentStatus !== 'paid' && hasPermission('contractorBill', 'edit') && (
        <div className="card p-6 mt-6 shadow-sm border border-emerald-100 bg-emerald-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <HiOutlineCash className="text-emerald-500" /> Payment Action Required
            </h3>
            <p className="text-sm text-slate-600 mt-1">Pending Request: <strong className="text-emerald-700">{formatCurrency(bill.paymentRequested - bill.amountPaid)}</strong></p>
          </div>

          {!showPaymentForm ? (
            <button onClick={() => setShowPaymentForm(true)} className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 hover:border-emerald-700 border-emerald-600 shadow-md shadow-emerald-600/20 px-8">
              Release Payment
            </button>
          ) : (
            <form onSubmit={handleRecordPayment} className="flex gap-2 items-center">
              <input
                type="number"
                required
                min="1"
                max={bill.paymentRequested - bill.amountPaid}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder="Amount to release"
                className="form-input border-emerald-300 w-48 font-bold"
              />
              <button type="submit" className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 border-none">
                Confirm
              </button>
              <button type="button" onClick={() => setShowPaymentForm(false)} className="btn btn-secondary">
                Cancel
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
}
