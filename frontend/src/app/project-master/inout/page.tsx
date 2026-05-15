'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineInboxIn,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineX,
  HiOutlineUpload,
  HiOutlineDownload,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineDocumentText,
  HiOutlineReply,
  HiOutlineUsers,
} from 'react-icons/hi';

const inoutStats = [
  { label: 'Total Records', value: '142', icon: HiOutlineInboxIn, color: 'blue' },
  { label: 'Pending Reply', value: '18', icon: HiOutlineClock, color: 'amber' },
  { label: 'Replied', value: '124', icon: HiOutlineCheckCircle, color: 'green' },
  { label: 'Overdue (15+ days)', value: '6', icon: HiOutlineExclamationCircle, color: 'red' },
];

const mockRecords = [
  { id: 'IOR-001', docDate: '2024-01-10', recDate: '2024-01-11', docRefNo: 'GMB/XEN/C/BVC/PB/339', from: 'Gujarat Maritime Board', detail: 'Inspection report for BVC port bridge project. Please review and respond.', ccMarking: ['Ketan Makadiya', 'Devang Lakhani'], actionSuggested: 'Ketan Makadiya', replyDate: '', replyRefNo: '', status: 'pending', daysOld: 18 },
  { id: 'IOR-002', docDate: '2024-01-08', recDate: '2024-01-08', docRefNo: 'GPH/tec/kie/gn/157/739/21', from: 'Gujarat Police Housing Nigam', detail: 'Work order for road construction Phase 2 at Rajkot.', ccMarking: ['Nikhil Davda'], actionSuggested: 'Devang Lakhani', replyDate: '2024-01-15', replyRefNo: 'SAEC/GPH/2024/001', status: 'replied', daysOld: 20 },
  { id: 'IOR-003', docDate: '2024-01-05', recDate: '2024-01-06', docRefNo: 'JN/PRAVASYO/BLC/GHTK/2810', from: 'PRADESHIK COMMISSNOR NAGARPALIKA', detail: 'Technical query regarding drainage survey report.', ccMarking: ['Ketan Makadiya', 'Nikhil Davda'], actionSuggested: 'Nikhil Davda', replyDate: '', replyRefNo: '', status: 'pending', daysOld: 25 },
  { id: 'IOR-004', docDate: '2024-01-12', recDate: '2024-01-13', docRefNo: 'RMC/ENG/2024/115', from: 'Rajkot Municipal Corporation', detail: 'Request for progress report on water supply project Kalawad.', ccMarking: ['Devang Lakhani'], actionSuggested: 'Ketan Makadiya', replyDate: '2024-01-20', replyRefNo: 'SAEC/RMC/2024/002', status: 'replied', daysOld: 8 },
];

const staffList = ['Ketan Makadiya', 'Devang Lakhani', 'Nikhil Davda'];

const statusCls: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  replied: 'bg-green-100 text-green-700 border-green-200',
  overdue: 'bg-red-100 text-red-700 border-red-200',
};

const emptyForm = {
  docDate: '', recDate: '', docRefNo: '', from: '', detail: '',
  ccMarking: [] as string[], actionSuggested: '', replyDate: '', replyRefNo: '',
};

export default function InOutRegisterPage() {
  const [records, setRecords] = useState(mockRecords);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [viewRecord, setViewRecord] = useState<typeof mockRecords[0] | null>(null);
  const [showReplyModal, setShowReplyModal] = useState<typeof mockRecords[0] | null>(null);
  const [replyForm, setReplyForm] = useState({ replyDate: '', replyRefNo: '' });

  const filtered = records.filter(r => {
    const matchSearch = r.from.toLowerCase().includes(search.toLowerCase()) ||
      r.docRefNo.toLowerCase().includes(search.toLowerCase()) ||
      r.detail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || r.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setRecords(prev => prev.map(r => r.id === editingId ? { ...r, ...form } : r));
    } else {
      const newId = `IOR-${String(records.length + 1).padStart(3, '0')}`;
      setRecords(prev => [...prev, { id: newId, ...form, status: 'pending', daysOld: 0 }]);
    }
    setShowModal(false); setEditingId(null); setForm({ ...emptyForm });
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReplyModal) return;
    setRecords(prev => prev.map(r => r.id === showReplyModal.id ? { ...r, replyDate: replyForm.replyDate, replyRefNo: replyForm.replyRefNo, status: 'replied' } : r));
    setShowReplyModal(null); setReplyForm({ replyDate: '', replyRefNo: '' });
  };

  const openEdit = (r: typeof mockRecords[0]) => {
    setEditingId(r.id);
    setForm({ docDate: r.docDate, recDate: r.recDate, docRefNo: r.docRefNo, from: r.from, detail: r.detail, ccMarking: r.ccMarking, actionSuggested: r.actionSuggested, replyDate: r.replyDate, replyRefNo: r.replyRefNo });
    setShowModal(true);
  };

  const toggleCC = (name: string) => {
    setForm(f => ({ ...f, ccMarking: f.ccMarking.includes(name) ? f.ccMarking.filter(x => x !== name) : [...f.ccMarking, name] }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <HiOutlineInboxIn size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">In-Out Register</h1>
                <p className="text-sm text-slate-500">Track inward/outward documents, replies & to-do tasks</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"><HiOutlineDownload size={18} /> Export</button>
              <button onClick={() => { setForm({ ...emptyForm }); setEditingId(null); setShowModal(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-rose-600 text-white text-sm font-medium rounded-xl hover:from-orange-600 hover:to-rose-700 shadow-lg shadow-orange-500/25">
                <HiOutlinePlus size={18} /> Add Record
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {inoutStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{s.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color === 'blue' ? 'bg-blue-50 text-blue-600' : s.color === 'amber' ? 'bg-amber-50 text-amber-600' : s.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  <s.icon size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search from, ref no, detail..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
            {['All', 'Pending', 'Replied', 'Overdue'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Doc Date', 'Ref. No', 'From', 'Detail', 'Action By', 'Age', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 first:px-6 last:px-6 last:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-700">
                        <HiOutlineCalendar size={14} className="text-slate-400" />{r.docDate}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Rec: {r.recDate}</p>
                    </td>
                    <td className="px-4 py-4 text-xs font-mono text-slate-700 max-w-[120px] truncate">{r.docRefNo}</td>
                    <td className="px-4 py-4 text-sm text-slate-700 max-w-[140px]">{r.from}</td>
                    <td className="px-4 py-4 text-sm text-slate-600 max-w-[200px]">
                      <p className="truncate">{r.detail}</p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {r.ccMarking.map(cc => <span key={cc} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-xs rounded">{cc.split(' ')[0]}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{r.actionSuggested}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium ${r.daysOld >= 15 ? 'text-red-600' : 'text-slate-600'}`}>{r.daysOld}d</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusCls[r.status] || statusCls.pending}`}>
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                      {r.replyRefNo && <p className="text-xs text-slate-400 mt-0.5">{r.replyRefNo}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewRecord(r)} className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"><HiOutlineEye size={16} /></button>
                        <button onClick={() => openEdit(r)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><HiOutlinePencil size={16} /></button>
                        {r.status === 'pending' && (
                          <button onClick={() => { setShowReplyModal(r); setReplyForm({ replyDate: '', replyRefNo: '' }); }}
                            className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Mark Replied">
                            <HiOutlineReply size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={8} className="py-16 text-center text-slate-400">No records found</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
            Showing {filtered.length} of {records.length} records
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setShowModal(false); setEditingId(null); }} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">{editingId ? 'Edit Record' : 'Add New Record'}</h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><HiOutlineX size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Doc Date *</label>
                <input required type="date" value={form.docDate} onChange={e => setForm(f => ({ ...f, docDate: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Received Date</label>
                <input type="date" value={form.recDate} onChange={e => setForm(f => ({ ...f, recDate: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Doc Ref. No *</label>
                <input required type="text" value={form.docRefNo} onChange={e => setForm(f => ({ ...f, docRefNo: e.target.value }))} placeholder="e.g. GMB/XEN/C/001" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">From (Client) *</label>
                <input required type="text" value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Detail / Subject *</label>
                <textarea required rows={3} value={form.detail} onChange={e => setForm(f => ({ ...f, detail: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">CC Marking</label>
                <div className="space-y-1">
                  {staffList.map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.ccMarking.includes(s)} onChange={() => toggleCC(s)} className="rounded text-orange-500" />
                      <span className="text-sm text-slate-700">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Action Suggested (Assign To)</label>
                <select value={form.actionSuggested} onChange={e => setForm(f => ({ ...f, actionSuggested: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value="">Select staff</option>
                  {staffList.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Upload Document</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
                  <HiOutlineUpload size={20} className="mx-auto text-slate-400 mb-1" />
                  <p className="text-xs text-slate-500">Upload scanned document copy</p>
                </div>
              </div>
              <div className="col-span-2 flex justify-end gap-3 pt-2 border-t border-slate-200">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); }} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-orange-500 to-rose-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-orange-500/20">
                  {editingId ? 'Save Changes' : 'Add Record'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReplyModal(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Mark as Replied</h2>
              <button onClick={() => setShowReplyModal(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><HiOutlineX size={20} /></button>
            </div>
            <form onSubmit={handleReply} className="p-6 space-y-4">
              <p className="text-sm text-slate-500">Recording reply for: <span className="font-medium text-slate-900">{showReplyModal.docRefNo}</span></p>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Reply Date *</label>
                <input required type="date" value={replyForm.replyDate} onChange={e => setReplyForm(f => ({ ...f, replyDate: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Reply Ref. No *</label>
                <input required type="text" value={replyForm.replyRefNo} onChange={e => setReplyForm(f => ({ ...f, replyRefNo: e.target.value }))} placeholder="e.g. SAEC/2024/001" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
                <button type="button" onClick={() => setShowReplyModal(null)} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-xl">Mark Replied</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
