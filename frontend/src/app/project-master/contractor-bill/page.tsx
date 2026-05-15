'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { contractorBillApi } from '@/api/contractorBillApi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { 
    HiOutlinePlus, 
    HiOutlineDocumentText, 
    HiOutlineCash,
    HiOutlineClock,
    HiOutlineExclamationCircle,
    HiOutlineSearch,
    HiOutlineChevronRight,
    HiOutlineOfficeBuilding
} from 'react-icons/hi';
import StatsCard from '@/components/StatsCard';

export default function ContractorBillDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [bills, setBills] = useState<any[]>([]);

  // Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, billsData] = await Promise.all([
        contractorBillApi.getStats(),
        contractorBillApi.getAll()
      ]);
      setStats(statsData);
      setBills(billsData || []);
    } catch (error: any) {
      toast.error('Failed to load contractor bills data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const filteredBills = useMemo(() => {
    let result = [...bills];

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter((b: any) => 
            b.projectName.toLowerCase().includes(query) || 
            b.contractorName.toLowerCase().includes(query) ||
            (b.paperBillNo && b.paperBillNo.toLowerCase().includes(query))
        );
    }

    if (statusFilter !== 'all') {
        result = result.filter((b: any) => b.status === statusFilter);
    }

    return result;
  }, [bills, searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
             Contractor Bills
          </h1>
          <p className="text-sm text-slate-500 mt-1">
             Manage dual-track billing (On-Paper vs On-Site progress)
          </p>
        </div>
        <div className="flex gap-3">
          {user && (
              <Link href="/project-master/contractor-bill/new" className="btn btn-primary shadow-lg shadow-blue-500/20">
                <HiOutlinePlus size={18} />
                Create New Bill
              </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Bills"
          value={stats?.totalBills || 0}
          icon={<HiOutlineDocumentText />}
          color="blue"
        />
        <StatsCard
          title="Total Contract Value"
          value={formatCurrency(stats?.totalContractValue)}
          icon={<HiOutlineOfficeBuilding />}
          color="indigo"
        />
        <StatsCard
          title="Pending Payments"
          value={formatCurrency(stats?.pendingPayments)}
          icon={<HiOutlineClock />}
          color="orange"
        />
        <StatsCard
          title="High Variance Alerts"
          value={stats?.highVarianceCount || 0}
          icon={<HiOutlineExclamationCircle />}
          color="red"
        />
      </div>

      {/* Bills List */}
      <div className="card shadow-sm border border-slate-100 flex flex-col mt-8">
          <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center shrink-0">
                All Contractor Bills
            </h3>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search project or contractor..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-input pl-9 text-sm h-10 w-full"
                    />
                </div>
                <div className="relative">
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="form-select text-sm h-10 min-w-[130px] font-medium text-slate-700"
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="approved">Approved</option>
                        <option value="paid">Paid</option>
                        <option value="disputed">Disputed</option>
                    </select>
                </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {filteredBills.length > 0 ? (
                <table className="data-table w-full">
                <thead>
                    <tr>
                    <th className="min-w-[200px]">Project / Contractor</th>
                    <th className="min-w-[180px]">📄 On-Paper (Billed)</th>
                    <th className="min-w-[150px]">🏗️ On-Site (Done)</th>
                    <th className="min-w-[120px]">Payment</th>
                    <th>Status</th>
                    <th className="text-right w-16">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBills.map((bill: any) => {
                        const paperPct = bill.totalContractValue ? (bill.paperBillAmount / bill.totalContractValue) * 100 : 0;
                        const variance = Math.abs(bill.onSiteCompletionPct - paperPct);
                        const isHighVariance = variance > 15 && bill.totalContractValue > 0;

                        return (
                        <tr key={bill._id} className="hover:bg-slate-50/50 cursor-pointer transition-colors group" onClick={() => router.push(`/project-master/contractor-bill/${bill._id}`)}>
                            <td>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-800 text-[14px] truncate" title={bill.projectName}>
                                        {bill.projectName}
                                    </span>
                                    <span className="text-[12px] text-slate-500 mt-0.5">
                                        {bill.contractorName} {bill.paperBillNo && `• ${bill.paperBillNo}`}
                                    </span>
                                </div>
                            </td>
                            <td>
                                 <div className="flex flex-col">
                                     <span className="font-bold text-slate-700 text-sm">{formatCurrency(bill.paperBillAmount)}</span>
                                     <span className="text-xs text-slate-500 mt-0.5">
                                         ({Math.round(paperPct)}% of Contract)
                                     </span>
                                 </div>
                            </td>
                            <td>
                                <div className="flex flex-col gap-1.5 w-full pr-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-indigo-500 rounded-full" 
                                                style={{ width: `${bill.onSiteCompletionPct}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">{bill.onSiteCompletionPct}%</span>
                                    </div>
                                    {isHighVariance && (
                                        <span className="inline-block px-1.5 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[9px] font-bold uppercase tracking-wider self-start">
                                            Variance Alert
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-800 text-sm">
                                        {formatCurrency(bill.paymentRequested)}
                                    </span>
                                    <span className={`text-[10px] uppercase font-bold tracking-wider mt-1 ${
                                        bill.paymentStatus === 'paid' ? 'text-emerald-500' : 
                                        bill.paymentStatus === 'partial' ? 'text-amber-500' : 'text-slate-400'
                                    }`}>
                                        {bill.paymentStatus}
                                    </span>
                                </div>
                            </td>
                            <td>
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                                    ['approved', 'paid'].includes(bill.status) ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                    bill.status === 'disputed' ? 'bg-red-50 text-red-600 border-red-200' :
                                    'bg-blue-50 text-blue-600 border-blue-200'
                                }`}>
                                    {bill.status}
                                </span>
                            </td>
                            <td className="text-right">
                                <button className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center ml-auto hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm">
                                    <HiOutlineChevronRight size={16} />
                                </button>
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
                </table>
            ) : (
                <div className="py-20 text-center flex flex-col items-center justify-center border-t border-slate-100">
                    <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 shadow-inner">
                        <HiOutlineDocumentText size={36} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">No contractor bills found</h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-sm">
                        Create your first contractor bill to start tracking dual-track progress.
                    </p>
                    <Link href="/project-master/contractor-bill/new" className="btn btn-primary btn-sm px-6">
                        Create First Bill
                    </Link>
                </div>
            )}
          </div>
      </div>
    </div>
  );
}
