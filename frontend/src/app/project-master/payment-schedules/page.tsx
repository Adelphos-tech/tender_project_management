'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineCash,
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
  HiOutlineTag,
  HiOutlineBan,
} from 'react-icons/hi';

const payStats = [
  { label: 'Total Scheduled', value: '34', icon: HiOutlineCash, color: 'blue' },
  { label: 'Due This Month', value: '8', icon: HiOutlineClock, color: 'amber' },
  { label: 'Overdue', value: '3', icon: HiOutlineExclamationCircle, color: 'red' },
  { label: 'Paid', value: '23', icon: HiOutlineCheckCircle, color: 'green' },
];

const mockPayments = [
  { id: 'PAY-001', paymentType: 'GST', category: 'GST', dueDate: '2024-01-20', scheduledDate: '2024-01-18', amount: 45600, detail: 'Monthly GST payment for December 2023', status: 'paid', paidDate: '2024-01-18' },
  { id: 'PAY-002', paymentType: 'TDS', category: 'TDS', dueDate: '2024-01-07', scheduledDate: '2024-01-05', amount: 18200, detail: 'TDS deduction – contractor payments Q3', status: 'overdue', paidDate: '' },
  { id: 'PAY-003', paymentType: 'Vehicle Loan', category: 'Vehicle Loan', dueDate: '2024-01-25', scheduledDate: '2024-01-23', amount: 12500, detail: 'EMI for Maruti Wagon R – Loan A/c #4532', status: 'pending', paidDate: '' },
  { id: 'PAY-004', paymentType: 'Excise', category: 'Excise', dueDate: '2024-02-05', scheduledDate: '2024-02-03', amount: 8400, detail: 'Excise duty on consumable purchases Q3', status: 'pending', paidDate: '' },
  { id: 'PAY-005', paymentType: 'GST', category: 'GST', dueDate: '2024-02-20', scheduledDate: '2024-02-18', amount: 52300, detail: 'Monthly GST payment for January 2024', status: 'pending', paidDate: '' },
  { id: 'PAY-006', paymentType: 'TDS', category: 'TDS', dueDate: '2024-02-07', scheduledDate: '2024-02-05', amount: 21000, detail: 'TDS on professional fees Q3', status: 'pending', paidDate: '' },
];

const paymentTypes = ['GST', 'TDS', 'Vehicle Loan', 'Excise', 'Other'];
const categories = ['All', 'GST', 'TDS', 'Vehicle Loan', 'Excise', 'Other'];

const statusCls: Record<string, string> = {
  paid:    'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  overdue: 'bg-red-100 text-red-700 border-red-200',
};

const emptyForm = {
  paymentType: '', category: '', dueDate: '', scheduledDate: '',
  amount: '', detail: '',
};

export default function PaymentSchedulesPage() {
  const [payments, setPayments] = useState(mockPayments);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [viewItem, setViewItem] = useState<typeof mockPayments[0] | null>(null);

  const filtered = payments.filter(p => {
    const matchSearch = p.detail.toLowerCase().includes(search.toLowerCase()) ||
      p.paymentType.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || p.category === catFilter;
    const matchStatus = statusFilter === 'All' || p.status === statusFilter.toLowerCase();
    return matchSearch && matchCat && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setPayments(prev => prev.map(p => p.id === editingId ? {
        ...p, paymentType: form.paymentType, category: form.category,
        dueDate: form.dueDate, scheduledDate: form.scheduledDate,
        amount: Number(form.amount), detail: form.detail,
      } : p));
    } else {
      const newId = `PAY-${String(payments.length + 1).padStart(3, '0')}`;
      setPayments(prev => [...prev, {
        id: newId, paymentType: form.paymentType, category: form.category,
        dueDate: form.dueDate, scheduledDate: form.scheduledDate,
        amount: Number(form.amount), detail: form.detail,
        status: 'pending', paidDate: '',
      }]);
    }
    setShowModal(false); setEditingId(null); setForm({ ...emptyForm });
  };

  const markPaid = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'paid', paidDate: new Date().toISOString().slice(0, 10) } : p));
  };

  const openEdit = (p: typeof mockPayments[0]) => {
    setEditingId(p.id);
    setForm({ paymentType: p.paymentType, category: p.category, dueDate: p.dueDate, scheduledDate: p.scheduledDate, amount: String(p.amount), detail: p.detail });
    setShowModal(true);
  };

  const totalDue = filtered.filter(p => p.status !== 'paid').reduce((a, b) => a + b.amount, 0);
  const totalPaid = filtered.filter(p => p.status === 'paid').reduce((a, b) => a + b.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                <HiOutlineCash size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Payment Schedules</h1>
                <p className="text-sm text-slate-500">Track GST, TDS, vehicle loan & scheduled payments</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"><HiOutlineDownload size={18} /> Export</button>
              <button onClick={() => { setForm({ ...emptyForm }); setEditingId(null); setShowModal(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25">
                <HiOutlinePlus size={18} /> Add Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {payStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{s.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color === 'blue' ? 'bg-blue-50 text-blue-600' : s.color === 'amber' ? 'bg-amber-50 text-amber-600' : s.color === 'red' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  <s.icon size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-5 text-white">
            <p className="text-sm text-red-100 mb-1">Total Amount Due / Overdue</p>
            <p className="text-3xl font-bold">₹{totalDue.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white">
            <p className="text-sm text-green-100 mb-1">Total Paid (filtered)</p>
            <p className="text-3xl font-bold">₹{totalPaid.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search payment type or detail..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
            {['All', 'Pending', 'Paid', 'Overdue'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Type / Category', 'Detail', 'Scheduled Date', 'Due Date', 'Amount', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 first:px-6 last:px-6 last:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-violet-100 text-violet-700 rounded-lg text-xs font-semibold">{p.paymentType}</span>
                      <p className="text-xs text-slate-400 mt-1">{p.id}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700 max-w-[220px]">
                      <p className="truncate">{p.detail}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-700">
                        <HiOutlineCalendar size={14} className="text-slate-400" />{p.scheduledDate}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`flex items-center gap-1 text-sm font-medium ${p.status === 'overdue' ? 'text-red-600' : 'text-slate-700'}`}>
                        {p.status === 'overdue' && <HiOutlineExclamationCircle size={14} />}
                        {p.dueDate}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900">₹{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusCls[p.status]}`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                      {p.paidDate && <p className="text-xs text-slate-400 mt-0.5">Paid: {p.paidDate}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewItem(p)} className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg"><HiOutlineEye size={16} /></button>
                        <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><HiOutlinePencil size={16} /></button>
                        {p.status !== 'paid' && (
                          <button onClick={() => markPaid(p.id)} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Mark Paid">
                            <HiOutlineCheckCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} className="py-16 text-center text-slate-400">No payment records found</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
            Showing {filtered.length} of {payments.length} records
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setShowModal(false); setEditingId(null); }} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">{editingId ? 'Edit Payment' : 'Add Payment Schedule'}</h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><HiOutlineX size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Type *</label>
                  <select required value={form.paymentType} onChange={e => setForm(f => ({ ...f, paymentType: e.target.value, category: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none">
                    <option value="">Select</option>
                    {paymentTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (₹) *</label>
                  <input required type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Scheduled Date *</label>
                  <input required type="date" value={form.scheduledDate} onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date *</label>
                  <input required type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Detail *</label>
                <textarea required rows={3} value={form.detail} onChange={e => setForm(f => ({ ...f, detail: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none" placeholder="Describe the payment..." />
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-3 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-colors">
                <HiOutlineUpload size={18} className="mx-auto text-slate-400 mb-1" />
                <p className="text-xs text-slate-500">Upload bill copy</p>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); }} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-violet-500/20">
                  {editingId ? 'Save Changes' : 'Add Schedule'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
