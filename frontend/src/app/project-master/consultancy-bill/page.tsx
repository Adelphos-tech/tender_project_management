'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineDocumentText,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineUpload,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineCurrencyRupee,
  HiOutlineCalendar,
  HiOutlineOfficeBuilding,
  HiOutlineClipboardList,
} from 'react-icons/hi';

const billStats = [
  { label: 'Total Bills', value: '42', icon: HiOutlineDocumentText, color: 'blue' },
  { label: 'Total Invoiced', value: '₹28.4L', icon: HiOutlineCurrencyRupee, color: 'indigo' },
  { label: 'Pending Payment', value: '₹6.2L', icon: HiOutlineClock, color: 'amber' },
  { label: 'Paid', value: '₹22.2L', icon: HiOutlineCheckCircle, color: 'green' },
];

const mockBills = [
  {
    id: 'CB-001', invoiceNo: 'SAEC/INV/2024/001', date: '2024-01-10',
    client: 'Gujarat Police Housing Nigam', project: 'Road Construction – Rajkot Phase 2',
    workOrder: 'WO/GPH/2024/001', serviceType: 'PMC',
    basicAmount: 210000, gst: 37800, totalAmount: 247800,
    tds: 21000, netPayable: 226800,
    status: 'paid', paidDate: '2024-01-28', remarks: '',
  },
  {
    id: 'CB-002', invoiceNo: 'SAEC/INV/2024/002', date: '2024-01-15',
    client: 'Kalawad Gram Panchayat', project: 'Water Supply – Kalawad',
    workOrder: 'WO/KGP/2024/002', serviceType: 'TPI',
    basicAmount: 90000, gst: 16200, totalAmount: 106200,
    tds: 9000, netPayable: 97200,
    status: 'pending', paidDate: '', remarks: 'Follow-up on Jan 30',
  },
  {
    id: 'CB-003', invoiceNo: 'SAEC/INV/2024/003', date: '2024-01-20',
    client: 'Rajkot Municipal Corporation', project: 'Street Light – Phase 1',
    workOrder: 'WO/RMC/2023/008', serviceType: 'PMC',
    basicAmount: 155000, gst: 27900, totalAmount: 182900,
    tds: 15500, netPayable: 167400,
    status: 'partial', paidDate: '2024-01-25', remarks: '₹80K received, balance pending',
  },
  {
    id: 'CB-004', invoiceNo: 'SAEC/INV/2024/004', date: '2024-02-01',
    client: 'Gujarat Maritime Board', project: 'BVC Port Survey',
    workOrder: 'WO/GMB/2024/004', serviceType: 'DPR',
    basicAmount: 320000, gst: 57600, totalAmount: 377600,
    tds: 32000, netPayable: 345600,
    status: 'pending', paidDate: '', remarks: '',
  },
];

const statusConfig: Record<string, { label: string; cls: string }> = {
  paid:    { label: 'Paid',    cls: 'bg-green-100 text-green-700 border-green-200' },
  pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  partial: { label: 'Partial', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  overdue: { label: 'Overdue', cls: 'bg-red-100 text-red-700 border-red-200' },
};

const serviceTypes = ['PMC', 'TPI', 'DPR', 'Survey', 'Other'];

const emptyForm = {
  date: '', client: '', project: '', workOrder: '', serviceType: '',
  basicAmount: '', gstPercent: '18', tdsPercent: '10', remarks: '',
};

export default function ConsultancyBillPage() {
  const [bills, setBills] = useState(mockBills);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [viewBill, setViewBill] = useState<typeof mockBills[0] | null>(null);

  const filtered = bills.filter(b => {
    const matchSearch =
      b.client.toLowerCase().includes(search.toLowerCase()) ||
      b.project.toLowerCase().includes(search.toLowerCase()) ||
      b.invoiceNo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || b.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const computedAmounts = () => {
    const basic = Number(form.basicAmount) || 0;
    const gst = Math.round(basic * (Number(form.gstPercent) / 100));
    const total = basic + gst;
    const tds = Math.round(basic * (Number(form.tdsPercent) / 100));
    const net = total - tds;
    return { gst, total, tds, net };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { gst, total, tds, net } = computedAmounts();
    if (editingId) {
      setBills(prev => prev.map(b => b.id === editingId ? {
        ...b, date: form.date, client: form.client, project: form.project,
        workOrder: form.workOrder, serviceType: form.serviceType,
        basicAmount: Number(form.basicAmount), gst, totalAmount: total,
        tds, netPayable: net, remarks: form.remarks,
      } : b));
    } else {
      const nextNo = bills.length + 1;
      const newId = `CB-${String(nextNo).padStart(3, '0')}`;
      const invoiceNo = `SAEC/INV/2024/${String(nextNo).padStart(3, '0')}`;
      setBills(prev => [...prev, {
        id: newId, invoiceNo, date: form.date, client: form.client,
        project: form.project, workOrder: form.workOrder, serviceType: form.serviceType,
        basicAmount: Number(form.basicAmount), gst, totalAmount: total,
        tds, netPayable: net, status: 'pending', paidDate: '', remarks: form.remarks,
      }]);
    }
    setShowModal(false); setEditingId(null); setForm({ ...emptyForm });
  };

  const markPaid = (id: string) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, status: 'paid', paidDate: new Date().toISOString().slice(0, 10) } : b));
  };

  const openEdit = (b: typeof mockBills[0]) => {
    setEditingId(b.id);
    setForm({ date: b.date, client: b.client, project: b.project, workOrder: b.workOrder, serviceType: b.serviceType, basicAmount: String(b.basicAmount), gstPercent: '18', tdsPercent: '10', remarks: b.remarks });
    setShowModal(true);
  };

  const { gst: previewGst, total: previewTotal, tds: previewTds, net: previewNet } = computedAmounts();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <HiOutlineDocumentText size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Consultancy Bills</h1>
                <p className="text-sm text-slate-500">Manage invoices, GST, TDS & payment tracking</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
                <HiOutlineDownload size={18} /> Export
              </button>
              <button
                onClick={() => { setForm({ ...emptyForm }); setEditingId(null); setShowModal(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/25"
              >
                <HiOutlinePlus size={18} /> New Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {billStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  s.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  s.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                  s.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  'bg-green-50 text-green-600'}`}>
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search client, project, invoice no..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {['All', 'Pending', 'Paid', 'Partial', 'Overdue'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Invoice', 'Client / Project', 'Service', 'Basic Amt', 'GST', 'Total', 'TDS', 'Net Payable', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 first:px-6 last:px-6 last:text-right whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 text-sm">{b.invoiceNo}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{b.date}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-slate-900 max-w-[160px] truncate">{b.client}</p>
                      <p className="text-xs text-slate-400 max-w-[160px] truncate">{b.project}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold">{b.serviceType}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700 font-medium">₹{b.basicAmount.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">₹{b.gst.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">₹{b.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-red-600">-₹{b.tds.toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm font-bold text-indigo-700">₹{b.netPayable.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[b.status]?.cls}`}>
                        {statusConfig[b.status]?.label}
                      </span>
                      {b.paidDate && <p className="text-xs text-slate-400 mt-0.5">{b.paidDate}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewBill(b)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><HiOutlineEye size={16} /></button>
                        <button onClick={() => openEdit(b)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><HiOutlinePencil size={16} /></button>
                        {b.status !== 'paid' && (
                          <button onClick={() => markPaid(b.id)} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Mark Paid">
                            <HiOutlineCheckCircle size={16} />
                          </button>
                        )}
                        <button onClick={() => setBills(prev => prev.filter(x => x.id !== b.id))} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><HiOutlineTrash size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={10} className="py-16 text-center text-slate-400">No bills found</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
            Showing {filtered.length} of {bills.length} invoices
          </div>
        </motion.div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setShowModal(false); setEditingId(null); }} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">{editingId ? 'Edit Invoice' : 'New Consultancy Invoice'}</h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><HiOutlineX size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Invoice Date *</label>
                <input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Service Type *</label>
                <select required value={form.serviceType} onChange={e => setForm(f => ({ ...f, serviceType: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Select</option>
                  {serviceTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Client / Department *</label>
                <input required type="text" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} placeholder="e.g. Gujarat Police Housing Nigam" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Project Name *</label>
                <input required type="text" value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} placeholder="As per work order" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Work Order No.</label>
                <input type="text" value={form.workOrder} onChange={e => setForm(f => ({ ...f, workOrder: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Basic Amount (₹) *</label>
                <input required type="number" value={form.basicAmount} onChange={e => setForm(f => ({ ...f, basicAmount: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">GST %</label>
                <select value={form.gstPercent} onChange={e => setForm(f => ({ ...f, gstPercent: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  {['0', '5', '12', '18', '28'].map(v => <option key={v} value={v}>{v}%</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">TDS %</label>
                <select value={form.tdsPercent} onChange={e => setForm(f => ({ ...f, tdsPercent: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  {['0', '2', '5', '10'].map(v => <option key={v} value={v}>{v}%</option>)}
                </select>
              </div>
              {/* Live preview */}
              {form.basicAmount && (
                <div className="col-span-2 bg-indigo-50 border border-indigo-200 rounded-xl p-4 grid grid-cols-4 gap-4 text-center">
                  {[['Basic', `₹${Number(form.basicAmount).toLocaleString()}`], ['+ GST', `₹${previewGst.toLocaleString()}`], ['Total', `₹${previewTotal.toLocaleString()}`], ['- TDS', `₹${previewTds.toLocaleString()}`]].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-xs text-indigo-500 font-medium mb-0.5">{label}</p>
                      <p className="text-sm font-bold text-indigo-800">{val}</p>
                    </div>
                  ))}
                  <div className="col-span-4 mt-1 pt-3 border-t border-indigo-200 flex justify-between items-center">
                    <span className="text-sm font-semibold text-indigo-700">Net Payable</span>
                    <span className="text-lg font-bold text-indigo-900">₹{previewNet.toLocaleString()}</span>
                  </div>
                </div>
              )}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Remarks</label>
                <textarea rows={2} value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Upload Invoice / Supporting Doc</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                  <HiOutlineUpload size={18} className="mx-auto text-slate-400 mb-1" />
                  <p className="text-xs text-slate-500">Upload PDF invoice or bill copy</p>
                </div>
              </div>
              <div className="col-span-2 flex justify-end gap-3 pt-2 border-t border-slate-200">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); }} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/20">
                  {editingId ? 'Save Changes' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Modal */}
      {viewBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewBill(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Invoice preview header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="font-bold text-white text-lg">{viewBill.invoiceNo}</h2>
                <p className="text-indigo-200 text-xs">SAEC Consultancy Services</p>
              </div>
              <button onClick={() => setViewBill(null)} className="p-2 text-indigo-200 hover:text-white rounded-lg"><HiOutlineX size={20} /></button>
            </div>
            <div className="p-6 space-y-2.5 text-sm">
              {([
                ['Date', viewBill.date],
                ['Client', viewBill.client],
                ['Project', viewBill.project],
                ['Work Order', viewBill.workOrder],
                ['Service Type', viewBill.serviceType],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-slate-900 font-medium">{v}</span>
                </div>
              ))}
              <div className="mt-3 bg-indigo-50 rounded-xl p-4 space-y-2">
                {[
                  ['Basic Amount', `₹${viewBill.basicAmount.toLocaleString()}`],
                  ['GST (18%)', `+ ₹${viewBill.gst.toLocaleString()}`],
                  ['Total', `₹${viewBill.totalAmount.toLocaleString()}`],
                  ['TDS (10%)', `- ₹${viewBill.tds.toLocaleString()}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-slate-600">{k}</span>
                    <span className="font-medium text-slate-900">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-indigo-200 font-bold text-indigo-800">
                  <span>Net Payable</span>
                  <span>₹{viewBill.netPayable.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Status</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[viewBill.status]?.cls}`}>{statusConfig[viewBill.status]?.label}</span>
              </div>
              {viewBill.remarks && (
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Remarks</span>
                  <span className="text-slate-700 text-right max-w-[200px]">{viewBill.remarks}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
