'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fundFlowApi } from '@/api/fundFlowApi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format, differenceInDays } from 'date-fns';
import { 
    HiOutlinePlus, 
    HiOutlineFolderOpen, 
    HiOutlineCash,
    HiOutlineClock,
    HiOutlineExclamationCircle,
    HiOutlineSearch,
    HiOutlineFilter,
    HiOutlineChevronRight
} from 'react-icons/hi';
import StatsCard from '@/components/StatsCard';

export default function FundFlowDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);

  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, projectsData] = await Promise.all([
        fundFlowApi.getStats(),
        fundFlowApi.getProjects()
      ]);
      setStats(statsData);
      setProjects(projectsData || []);
    } catch (error: any) {
      toast.error('Failed to load fund flow data');
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

  // Filter and sort logic
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(p => 
            p.projectName.toLowerCase().includes(query) || 
            p.clientName.toLowerCase().includes(query)
        );
    }

    if (statusFilter !== 'all') {
        result = result.filter(p => p.status === statusFilter);
    }

    switch (sortBy) {
        case 'newest':
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        case 'oldest':
            result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
        case 'name_asc':
            result.sort((a, b) => a.projectName.localeCompare(b.projectName));
            break;
        case 'name_desc':
            result.sort((a, b) => b.projectName.localeCompare(a.projectName));
            break;
        case 'amount_desc':
            result.sort((a, b) => b.totalAmount - a.totalAmount);
            break;
        case 'amount_asc':
            result.sort((a, b) => a.totalAmount - b.totalAmount);
            break;
    }

    return result;
  }, [projects, searchQuery, statusFilter, sortBy]);

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
             Fund Flow
          </h1>
          <p className="text-sm text-slate-500 mt-1">
             Manage project financials and payment schedules
          </p>
        </div>
        <div className="flex gap-3">
          {['admin', 'manager'].includes(user?.role || '') && (
              <Link href="/project-master/fund-flow/new" className="btn btn-primary shadow-lg shadow-blue-500/20">
                <HiOutlinePlus size={18} />
                New Project Phase
              </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Projects"
          value={stats?.totalProjects || 0}
          icon={<HiOutlineFolderOpen />}
          color="blue"
        />
        <StatsCard
          title="Total Collected"
          value={formatCurrency(stats?.totalCollected)}
          icon={<HiOutlineCash />}
          color="emerald"
        />
        <StatsCard
          title="Total Pending"
          value={formatCurrency(stats?.totalPending)}
          icon={<HiOutlineClock />}
          color="orange"
        />
        <StatsCard
          title="Overdue Dues"
          value={stats?.overdueCount || 0}
          icon={<HiOutlineExclamationCircle />}
          color="red"
        />
      </div>

      {/* Project List */}
      <div className="card shadow-sm border border-slate-100 flex flex-col mt-8">
          <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center shrink-0">
                Project Portfolio
            </h3>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 sm:w-64">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search projects or clients..." 
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
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                    </select>
                </div>
                <div className="relative">
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="form-select text-sm h-10 min-w-[130px] font-medium text-slate-700"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="amount_desc">Highest Value</option>
                        <option value="amount_asc">Lowest Value</option>
                        <option value="name_asc">Name (A-Z)</option>
                        <option value="name_desc">Name (Z-A)</option>
                    </select>
                </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {filteredAndSortedProjects.length > 0 ? (
                <table className="data-table w-full whitespace-nowrap lg:whitespace-normal">
                <thead>
                    <tr>
                    <th className="w-12 text-center">#</th>
                    <th className="min-w-[200px]">Project Details</th>
                    <th className="min-w-[180px]">Pricing Outline</th>
                    <th className="min-w-[180px]">Timeline</th>
                    <th className="min-w-[150px]">Payment Plan</th>
                    <th>Status</th>
                    <th className="text-right w-24">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAndSortedProjects.map((proj: any, index: number) => {
                        const remaining = proj.totalAmount - (proj.paidAmount || 0);
                        const daysDuration = proj.endDate ? differenceInDays(new Date(proj.endDate), new Date(proj.startDate)) : null;

                        return (
                        <tr key={proj._id} className="hover:bg-slate-50/50 cursor-pointer transition-colors group" onClick={() => router.push(`/project-master/fund-flow/${proj._id}`)}>
                            <td className="text-center font-semibold text-slate-400 text-sm">
                                {index + 1}
                            </td>
                            <td>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-800 text-[14px] truncate" title={proj.projectName}>
                                        {proj.projectName}
                                    </span>
                                    <span className="text-[12px] text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                                        {proj.clientName}
                                    </span>
                                </div>
                            </td>
                            <td>
                                 <div className="flex flex-col">
                                     <span className="font-extrabold text-slate-800 text-sm tracking-tight">{formatCurrency(proj.totalAmount)}</span>
                                     <div className="flex items-center gap-2 mt-1 text-[11px] font-medium">
                                         <span className="text-emerald-600">Paid: {formatCurrency(proj.paidAmount)}</span>
                                         <span className="text-slate-300">|</span>
                                         <span className="text-amber-600">Rem: {formatCurrency(remaining)}</span>
                                     </div>
                                 </div>
                            </td>
                            <td>
                                <div className="flex items-start flex-col gap-1">
                                    <span className="text-[13px] font-medium text-slate-700">
                                        {format(new Date(proj.startDate), 'MMM dd, yyyy')} → {proj.endDate ? format(new Date(proj.endDate), 'MMM dd, yyyy') : <i className="text-slate-400">Ongoing</i>}
                                    </span>
                                    {daysDuration && (
                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                            {daysDuration} days duration
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="flex flex-col items-start gap-1.5 w-full pr-4">
                                    <div className="flex w-full justify-between items-center">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                            proj.paymentMode === 'automatic' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                            {proj.paymentMode} Mode
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-500">
                                            {Math.round(proj.progressPercentage)}%
                                        </span>
                                    </div>
                                    <div className="w-full flex items-center gap-2 relative">
                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-slate-800 rounded-full" 
                                                style={{ width: `${proj.progressPercentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-500">
                                        {proj.totalInstallments} total installments
                                    </span>
                                    {proj.overdueCount > 0 && (
                                        <span className="text-[10px] font-bold text-red-500 mt-0.5">
                                            ⚠️ {proj.overdueCount} payment(s) overdue
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td>
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                                    proj.status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm shadow-blue-500/10' : 
                                    proj.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm shadow-emerald-500/10' :
                                    proj.status === 'on-hold' ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-sm shadow-orange-500/10' :
                                    'bg-slate-50 text-slate-600 border-slate-200'
                                }`}>
                                    {proj.status}
                                </span>
                            </td>
                            <td className="text-right">
                                <button className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center ml-auto hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm">
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
                        <HiOutlineFolderOpen size={36} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">No projects found</h3>
                    <p className="text-sm text-slate-500 mb-6 max-w-sm">
                        {searchQuery || statusFilter !== 'all' 
                            ? "We couldn't find any projects matching your current filters." 
                            : "Create your first project to start tracking funds."}
                    </p>
                    {searchQuery || statusFilter !== 'all' ? (
                        <button 
                            onClick={() => { setSearchQuery(''); setStatusFilter('all'); }} 
                            className="btn btn-secondary btn-sm"
                        >
                            Clear Filters
                        </button>
                    ) : (
                        ['admin', 'manager'].includes(user?.role || '') && (
                            <Link href="/project-master/fund-flow/new" className="btn btn-primary btn-sm px-6">
                                Create First Project
                            </Link>
                        )
                    )}
                </div>
            )}
          </div>
      </div>
    </div>
  );
}
