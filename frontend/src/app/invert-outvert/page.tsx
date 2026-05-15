'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { documentApi } from '@/api/documentApi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
    HiOutlineUpload, 
    HiOutlineDownload, 
    HiOutlineDocumentReport,
    HiOutlineDocumentText,
    HiOutlinePhotograph,
    HiOutlineDatabase
} from 'react-icons/hi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import StatsCard from '@/components/StatsCard';

export default function InvertOutvertDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentDocs, setRecentDocs] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, docsData] = await Promise.all([
        documentApi.getDocumentStats(),
        documentApi.getDocuments({ limit: 5 })
      ]);
      setStats(statsData);
      setRecentDocs(docsData.documents || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getChartData = () => {
    if (!stats || !stats.breakdown) return [];
    
    return [
      { name: 'PDF', value: stats.breakdown.pdf || 0, color: '#ef4444' }, // Red
      { name: 'Excel', value: stats.breakdown.excel || 0, color: '#22c55e' }, // Green
      { name: 'Image', value: stats.breakdown.image || 0, color: '#3b82f6' }, // Blue
      { name: 'Other', value: stats.breakdown.other || 0, color: '#94a3b8' }, // Slate
    ].filter(item => item.value > 0);
  };

  const chartData = getChartData();

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
             {t('nav.documents')} Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
             Manage and track all file exchanges across the system
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/invert-outvert/upload" className="btn btn-primary shadow-lg shadow-blue-500/20">
            <HiOutlineUpload size={18} />
            Invert (Upload)
          </Link>
          <Link href="/invert-outvert/outvert" className="btn btn-secondary border border-slate-200 hover:border-slate-300">
            <HiOutlineDownload size={18} />
            Outvert (Browse)
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Documents"
          value={stats?.totalDocuments || 0}
          icon={<HiOutlineDocumentReport />}
          color="blue"
        />
        <StatsCard
          title="Inverted Files"
          value={stats?.totalInvert || 0}
          icon={<HiOutlineUpload />}
          color="emerald"
        />
        <StatsCard
          title="Outverted Files"
          value={stats?.totalOutvert || 0}
          icon={<HiOutlineDownload />}
          color="indigo"
        />
        <StatsCard
          title="Storage Used"
          value={formatFileSize(stats?.totalSizeBytes)}
          icon={<HiOutlineDatabase />}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card p-6 lg:col-span-1 shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">File Type Breakdown</h3>
          
          <div className="flex-1 flex flex-col justify-center items-center">
            {chartData.length > 0 ? (
                <div className="relative w-full h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                        itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                    <span className="text-3xl font-bold text-slate-800">{stats?.totalDocuments}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
                  </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl w-full h-[220px] border border-slate-100">
                    <HiOutlineDocumentText className="text-slate-300 mb-2" size={48} />
                    <p className="text-sm text-slate-500 font-medium">No files uploaded yet</p>
                </div>
            )}
            
            <div className="w-full mt-8 grid grid-cols-2 gap-y-3 gap-x-2">
                {chartData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-600 font-medium">{item.name}</span>
                        <span className="ml-auto font-bold text-slate-800">{item.value}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card lg:col-span-2 shadow-sm border border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recent Uploads</h3>
            <Link href="/invert-outvert/outvert" className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            {recentDocs.length > 0 ? (
                <table className="data-table">
                <thead>
                    <tr>
                    <th>File</th>
                    <th>Type</th>
                    <th>Uploaded By</th>
                    <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {recentDocs.map((doc: any) => (
                    <tr key={doc._id} className="hover:bg-slate-50/50 transition-colors">
                        <td>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center ${
                                    doc.fileType === 'pdf' ? 'bg-red-50 text-red-500' :
                                    doc.fileType === 'excel' ? 'bg-green-50 text-green-600' :
                                    doc.fileType === 'image' ? 'bg-blue-50 text-blue-500' :
                                    'bg-slate-100 text-slate-500'
                                }`}>
                                    {doc.fileType === 'pdf' ? <HiOutlineDocumentText size={18} /> :
                                     doc.fileType === 'excel' ? <HiOutlineDocumentReport size={18} /> :
                                     doc.fileType === 'image' ? <HiOutlinePhotograph size={18} /> :
                                     <HiOutlineDocumentText size={18} />}
                                </div>
                                <div className="max-w-[200px]">
                                    <p className="font-semibold text-slate-800 text-[13px] truncate" title={doc.title}>{doc.title}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">{formatFileSize(doc.fileSize)}</p>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                doc.type === 'invert' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                            }`}>
                                {doc.type}
                            </span>
                        </td>
                        <td>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                    {(doc.uploadedBy?.name || 'U').charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[13px] font-medium text-slate-700">{doc.uploadedBy?.name || 'Unknown'}</span>
                            </div>
                        </td>
                        <td className="text-[13px] text-slate-500">
                             {new Date(doc.createdAt).toLocaleDateString()}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                <div className="p-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <HiOutlineUpload size={32} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-1">No uploads yet</p>
                    <p className="text-xs text-slate-400 mb-6">Inverted files will appear here.</p>
                    <Link href="/invert-outvert/upload" className="btn btn-primary btn-sm">
                        Upload First File
                    </Link>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
