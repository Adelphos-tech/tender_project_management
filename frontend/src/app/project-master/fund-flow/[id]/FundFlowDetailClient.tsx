'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  HiOutlineArrowLeft,
  HiOutlineBriefcase,
  HiOutlineCash,
  HiOutlineCheck,
  HiOutlineTrash
} from 'react-icons/hi';
import InstallmentStatusBadge from '@/components/InstallmentStatusBadge';

interface FundFlowDetailClientProps {
  id: string;
}

export default function FundFlowDetailClient({ id }: FundFlowDetailClientProps) {
  const router = useRouter();
  const { hasPermission } = useAuth();

  const [project] = useState({
    _id: id,
    projectName: 'Highway Construction',
    clientName: 'NHAI',
    totalAmount: 5000000,
    paidAmount: 2500000,
    progressPercentage: 50,
    status: 'active',
    startDate: '2024-01-01',
    paymentMode: 'milestone',
  });

  const [installments] = useState([
    { _id: 'i1', installmentNo: 1, amount: 1000000, dueDate: '2024-01-15', status: 'paid', paidDate: '2024-01-14' },
    { _id: 'i2', installmentNo: 2, amount: 1500000, dueDate: '2024-02-15', status: 'paid', paidDate: '2024-02-14' },
    { _id: 'i3', installmentNo: 3, amount: 2500000, dueDate: '2024-03-15', status: 'pending' },
  ]);

  const handleMarkPaid = async () => {
    toast.success('Payment marked as paid');
  };

  const handleDelete = async () => {
    if (!hasPermission('fundFlow', 'delete')) {
      toast.error('No permission to delete');
      return;
    }
    if (!window.confirm('Delete this project?')) return;
    toast.success('Project deleted');
    router.push('/project-master/fund-flow');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-12 space-y-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/project-master/fund-flow"
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-sm"
          >
            <HiOutlineArrowLeft size={20} />
          </Link>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            project.status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-200' :
            project.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
            'bg-slate-50 text-slate-600 border-slate-200'
          }`}>
            {project.status}
          </span>
        </div>

        <div className="flex gap-2">
          {hasPermission('fundFlow', 'delete') && (
            <button onClick={handleDelete} className="btn btn-secondary text-red-600 hover:bg-red-50 hover:border-red-200">
              <HiOutlineTrash size={18} /> Delete Project
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6 md:p-8 shadow-sm border border-slate-100 h-full flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                <HiOutlineBriefcase size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{project.projectName}</h1>
                <p className="text-slate-500 font-medium">{project.clientName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100 mt-auto relative z-10">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Amount</p>
                <p className="text-lg font-bold text-slate-800">{formatCurrency(project.totalAmount)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Collected</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(project.paidAmount)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Date</p>
                <p className="text-sm font-semibold text-slate-700">{format(new Date(project.startDate), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mode</p>
                <p className="text-sm font-semibold text-slate-700 capitalize">{project.paymentMode}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 shadow-sm border border-slate-100 h-full flex flex-col justify-center items-center text-center bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Payment Progress</h3>

            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
                <circle
                  cx="64" cy="64" r="60"
                  stroke="currentColor"
                  strokeWidth="8" fill="transparent"
                  strokeDasharray={377}
                  strokeDashoffset={377 - (377 * project.progressPercentage) / 100}
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-slate-800">{project.progressPercentage}%</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 font-medium">
              {project.progressPercentage === 100 ? 'Project Fully Paid!' : 'Awaiting remaining installments'}
            </p>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border border-slate-100 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 bg-white">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <HiOutlineCash className="text-blue-500" size={20} />
            Payment Installments Collection
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-16 text-center">Phase #</th>
                <th>Due Date</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Paid On</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {installments.map((inst: any) => (
                <tr key={inst._id} className={inst.status === 'paid' ? 'bg-emerald-50/30' : inst.status === 'overdue' ? 'bg-red-50/30' : ''}>
                  <td className="text-center font-bold text-slate-400">
                    {inst.installmentNo}
                  </td>
                  <td>
                    <span className={`text-sm font-semibold ${inst.status === 'overdue' ? 'text-red-600' : 'text-slate-700'}`}>
                      {format(new Date(inst.dueDate), 'MMM dd, yyyy')}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold text-slate-800">{formatCurrency(inst.amount)}</span>
                  </td>
                  <td>
                    <InstallmentStatusBadge status={inst.status} />
                  </td>
                  <td>
                    <span className="text-xs text-slate-500 italic">
                      {inst.paidDate ? format(new Date(inst.paidDate), 'MMM dd, yyyy') : '-'}
                    </span>
                  </td>
                  <td className="text-right">
                    {inst.status !== 'paid' ? (
                      <button
                        onClick={handleMarkPaid}
                        className="btn btn-primary btn-sm px-4 bg-emerald-500 hover:bg-emerald-600 border-none shadow-emerald-500/20 shadow-md inline-flex items-center gap-1"
                      >
                        <HiOutlineCheck size={14} /> Mark Paid
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                        <HiOutlineCheck size={14} /> Received
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
