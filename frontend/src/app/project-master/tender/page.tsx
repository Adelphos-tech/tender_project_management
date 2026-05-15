'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlineBriefcase,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineDownload,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineCurrencyRupee,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineGlobeAlt,
  HiOutlineExclamationCircle,
  HiOutlineUpload,
} from 'react-icons/hi';

const tenderStats = [
  { label: 'Total Applied', value: '38', change: '+4 this month', icon: HiOutlineBriefcase, color: 'blue' },
  { label: 'Open / Active', value: '14', change: 'Awaiting result', icon: HiOutlineClock, color: 'amber' },
  { label: 'Won / Assigned', value: '18', change: '47% win rate', icon: HiOutlineCheckCircle, color: 'green' },
  { label: 'Closed / Lost', value: '6', change: 'This quarter', icon: HiOutlineXCircle, color: 'red' },
];

const mockTenders = [
  { id: 'TND-001', date: '2024-01-10', name: 'Road Construction – Phase 2', dept: 'Gujarat Police Housing', state: 'Gujarat', city: 'Rajkot', platform: 'npro.gov.in', typeOfWork: 'Road', service: 'PMC', biddingDate: '2024-01-25', openingDate: '2024-01-26', tenderFee: 5000, emd: 50000, status: 'open', l1: 'Sharma Constructions', l1price: 4200000 },
  { id: 'TND-002', date: '2024-01-08', name: 'Water Supply Line – Kalawad', dept: 'Kalawad Gram Panchayat', state: 'Gujarat', city: 'Kalawad', platform: 'guj.npro.gov.in', typeOfWork: 'Water', service: 'TPI', biddingDate: '2024-01-20', openingDate: '2024-01-21', tenderFee: 2500, emd: 30000, status: 'won', l1: 'Patel Works', l1price: 3800000 },
  { id: 'TND-003', date: '2024-01-05', name: 'Office Renovation RMC', dept: 'Rajkot Municipal Corporation', state: 'Gujarat', city: 'Rajkot', platform: 'tendertiger.com', typeOfWork: 'Road', service: 'PMC', biddingDate: '2024-01-18', openingDate: '2024-01-19', tenderFee: 3000, emd: 40000, status: 'open', l1: '-', l1price: 0 },
  { id: 'TND-004', date: '2023-12-20', name: 'Street Light Installation', dept: 'Nagarpalika Kacheri', state: 'Gujarat', city: 'Jamnagar', platform: 'npro.gov.in', typeOfWork: 'Electrical', service: 'TPI', biddingDate: '2024-01-05', openingDate: '2024-01-06', tenderFee: 1500, emd: 20000, status: 'lost', l1: 'Joshi Electricals', l1price: 1900000 },
  { id: 'TND-005', date: '2024-01-12', name: 'Drainage Work – Phase 1', dept: 'Gujarat Police Housing', state: 'Gujarat', city: 'Rajkot', platform: 'npro.gov.in', typeOfWork: 'Water', service: 'PMC', biddingDate: '2024-01-30', openingDate: '2024-01-31', tenderFee: 4000, emd: 45000, status: 'open', l1: '-', l1price: 0 },
];

const statusConfig: Record<string, { label: string; cls: string }> = {
  open:   { label: 'Open',   cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  won:    { label: 'Won',    cls: 'bg-green-100 text-green-700 border-green-200' },
  lost:   { label: 'Lost',   cls: 'bg-red-100 text-red-700 border-red-200' },
  closed: { label: 'Closed', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
};

const emptyForm = {
  date: '', name: '', tenderId: '', dept: '', state: '', city: '', platform: '',
  typeOfWork: '', service: '', biddingDate: '', openingDate: '',
  tenderFee: '', emd: '', preBidMeeting: 'no', negotiation: 'no',
  l1: '', l1price: '', remarks: '',
};

export default function TenderPage() {
  const [tenders, setTenders] = useState(mockTenders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [viewTender, setViewTender] = useState<typeof mockTenders[0] | null>(null);

  const filtered = tenders.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.dept.toLowerCase().includes(search.toLowerCase()) ||
      t.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setTenders(prev => prev.map(t => t.id === editingId ? { ...t, name: form.name, dept: form.dept, state: form.state, city: form.city, platform: form.platform, typeOfWork: form.typeOfWork, service: form.service, biddingDate: form.biddingDate, openingDate: form.openingDate, tenderFee: Number(form.tenderFee), emd: Number(form.emd), date: form.date, l1: form.l1, l1price: Number(form.l1price) } : t));
    } else {
      const newId = `TND-${String(tenders.length + 1).padStart(3, '0')}`;
      setTenders(prev => [...prev, { id: newId, date: form.date, name: form.name, dept: form.dept, state: form.state, city: form.city, platform: form.platform, typeOfWork: form.typeOfWork, service: form.service, biddingDate: form.biddingDate, openingDate: form.openingDate, tenderFee: Number(form.tenderFee), emd: Number(form.emd), status: 'open', l1: form.l1 || '-', l1price: Number(form.l1price) || 0 }]);
    }
    setShowModal(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  const openEdit = (t: typeof mockTenders[0]) => {
    setEditingId(t.id);
    setForm({ date: t.date, name: t.name, tenderId: t.id, dept: t.dept, state: t.state, city: t.city, platform: t.platform, typeOfWork: t.typeOfWork, service: t.service, biddingDate: t.biddingDate, openingDate: t.openingDate, tenderFee: String(t.tenderFee), emd: String(t.emd), preBidMeeting: 'no', negotiation: 'no', l1: t.l1, l1price: String(t.l1price), remarks: '' });
    setShowModal(true);
  };

  const updateStatus = (id: string, status: string) => {
    setTenders(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <HiOutlineBriefcase size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Tender Management</h1>
                <p className="text-sm text-slate-500">Track tender applications, EMD, fees & status</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
                <HiOutlineDownload size={18} /> Export
              </button>
              <button
                onClick={() => { setForm({ ...emptyForm }); setEditingId(null); setShowModal(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
              >
                <HiOutlinePlus size={18} /> Add Tender
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {tenderStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{s.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.change}</p>
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tender name, dept, city..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['All', 'Open', 'Won', 'Lost', 'Closed'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Tender', 'Department', 'Location', 'Platform', 'Bidding Date', 'Fee / EMD', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 first:px-6 last:px-6 last:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 text-sm max-w-[200px]">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.id} · {t.typeOfWork} · {t.service}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{t.dept}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-700">
                        <HiOutlineLocationMarker size={14} className="text-slate-400" />{t.city}, {t.state}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">{t.platform}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{t.biddingDate}</td>
                    <td className="px-4 py-4">
                      <p className="text-xs text-slate-600">Fee: ₹{t.tenderFee.toLocaleString()}</p>
                      <p className="text-xs text-slate-600">EMD: ₹{t.emd.toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[t.status]?.cls}`}>
                        {statusConfig[t.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewTender(t)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><HiOutlineEye size={16} /></button>
                        <button onClick={() => openEdit(t)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><HiOutlinePencil size={16} /></button>
                        {t.status === 'open' && (
                          <>
                            <button onClick={() => updateStatus(t.id, 'won')} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Mark Won"><HiOutlineCheckCircle size={16} /></button>
                            <button onClick={() => updateStatus(t.id, 'lost')} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Mark Lost"><HiOutlineXCircle size={16} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="py-16 text-center text-slate-400">No tenders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
            Showing {filtered.length} of {tenders.length} tenders
          </div>
        </motion.div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setShowModal(false); setEditingId(null); }} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Tender' : 'Add New Tender'}</h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><HiOutlineX size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Date *</label>
                <input type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tender ID</label>
                <input type="text" value={form.tenderId} onChange={e => setForm(f => ({ ...f, tenderId: e.target.value }))} placeholder="As per advertisement" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Name of Tender *</label>
                <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter tender name as per advertisement" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Department / Client *</label>
                <input type="text" required value={form.dept} onChange={e => setForm(f => ({ ...f, dept: e.target.value }))} placeholder="e.g. Gujarat Police Housing" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Platform</label>
                <input type="text" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} placeholder="e.g. npro.gov.in" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">State</label>
                <input type="text" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="e.g. Gujarat" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="e.g. Rajkot" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Type of Work</label>
                <select value={form.typeOfWork} onChange={e => setForm(f => ({ ...f, typeOfWork: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select</option>
                  {['Road', 'Water', 'Electrical', 'Civil', 'Other'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Service</label>
                <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select</option>
                  {['PMC', 'TPI', 'DPR', 'Survey'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Bidding Last Date</label>
                <input type="date" value={form.biddingDate} onChange={e => setForm(f => ({ ...f, biddingDate: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Date of Opening</label>
                <input type="date" value={form.openingDate} onChange={e => setForm(f => ({ ...f, openingDate: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tender Fee (₹)</label>
                <input type="number" value={form.tenderFee} onChange={e => setForm(f => ({ ...f, tenderFee: e.target.value }))} placeholder="Amount" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">EMD (₹)</label>
                <input type="number" value={form.emd} onChange={e => setForm(f => ({ ...f, emd: e.target.value }))} placeholder="Amount" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Pre-bid Meeting</label>
                <select value={form.preBidMeeting} onChange={e => setForm(f => ({ ...f, preBidMeeting: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">L1 Contractor</label>
                <input type="text" value={form.l1} onChange={e => setForm(f => ({ ...f, l1: e.target.value }))} placeholder="L1 contractor name" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">L1 Price (₹)</label>
                <input type="number" value={form.l1price} onChange={e => setForm(f => ({ ...f, l1price: e.target.value }))} placeholder="Amount" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Upload Advertisement Copy</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <HiOutlineUpload size={20} className="mx-auto text-slate-400 mb-1" />
                  <p className="text-xs text-slate-500">Click to upload or drag & drop</p>
                </div>
              </div>
              <div className="col-span-2 flex justify-end gap-3 pt-2 border-t border-slate-200">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); }} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20">
                  {editingId ? 'Save Changes' : 'Add Tender'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Modal */}
      {viewTender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewTender(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Tender Details</h2>
              <button onClick={() => setViewTender(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><HiOutlineX size={20} /></button>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {[
                ['Tender ID', viewTender.id], ['Date', viewTender.date], ['Name', viewTender.name],
                ['Department', viewTender.dept], ['City / State', `${viewTender.city}, ${viewTender.state}`],
                ['Platform', viewTender.platform], ['Type / Service', `${viewTender.typeOfWork} / ${viewTender.service}`],
                ['Bidding Date', viewTender.biddingDate], ['Opening Date', viewTender.openingDate],
                ['Tender Fee', `₹${viewTender.tenderFee.toLocaleString()}`],
                ['EMD', `₹${viewTender.emd.toLocaleString()}`],
                ['L1 Contractor', viewTender.l1],
                ['L1 Price', viewTender.l1price > 0 ? `₹${viewTender.l1price.toLocaleString()}` : '-'],
                ['Status', viewTender.status.toUpperCase()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-medium">{k}</span>
                  <span className="text-slate-900 text-right">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
