'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineClipboardList,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiOutlineDocumentText,
  HiOutlineX,
  HiOutlineUpload,
  HiOutlineUserGroup,
  HiOutlineOfficeBuilding,
  HiOutlineDownload,
  HiOutlineChartBar,
} from 'react-icons/hi';

const wipStats = [
  { label: 'Active Projects', value: '11', icon: HiOutlineClipboardList, color: 'blue' },
  { label: 'Total Work Order Value', value: '₹4.2 Cr', icon: HiOutlineCurrencyRupee, color: 'green' },
  { label: 'RA Bills Raised', value: '28', icon: HiOutlineDocumentText, color: 'purple' },
  { label: 'Completed', value: '6', icon: HiOutlineCheckCircle, color: 'emerald' },
];

const mockWIP = [
  {
    id: 'WIP-001', projectName: 'Road Construction – Rajkot Phase 2', loi: 'received', agreement: 'done',
    workOrder: 'WO/GPH/2024/001', amount: 4200000, securityDeposit: 420000,
    hoCoordinator: 'Ketan Makadiya', roCoordinator: 'Devang Lakhani',
    l1: 'Ketan Makadiya', l2: 'Nikhil Davda', l3: 'Devang Lakhani', l4: '-',
    raBills: [
      { no: 1, date: '2024-02-01', customer: 'GPH', woNo: 'WO/GPH/2024/001', amount: 800000, saecFees: 16000 },
      { no: 2, date: '2024-03-15', customer: 'GPH', woNo: 'WO/GPH/2024/001', amount: 1200000, saecFees: 24000 },
    ],
    finalProgress: '62%', status: 'active', completionCert: false,
  },
  {
    id: 'WIP-002', projectName: 'Water Supply – Kalawad Panchayat', loi: 'received', agreement: 'pending',
    workOrder: 'WO/KGP/2024/002', amount: 1800000, securityDeposit: 180000,
    hoCoordinator: 'Devang Lakhani', roCoordinator: 'Nikhil Davda',
    l1: 'Nikhil Davda', l2: 'Ketan Makadiya', l3: '-', l4: '-',
    raBills: [
      { no: 1, date: '2024-02-20', customer: 'KGP', woNo: 'WO/KGP/2024/002', amount: 600000, saecFees: 12000 },
    ],
    finalProgress: '35%', status: 'active', completionCert: false,
  },
  {
    id: 'WIP-003', projectName: 'Street Light – Jamnagar', loi: 'received', agreement: 'done',
    workOrder: 'WO/JMC/2023/008', amount: 950000, securityDeposit: 95000,
    hoCoordinator: 'Ketan Makadiya', roCoordinator: 'Ketan Makadiya',
    l1: 'Devang Lakhani', l2: 'Nikhil Davda', l3: '-', l4: '-',
    raBills: [
      { no: 1, date: '2023-10-01', customer: 'JMC', woNo: 'WO/JMC/2023/008', amount: 400000, saecFees: 8000 },
      { no: 2, date: '2023-11-15', customer: 'JMC', woNo: 'WO/JMC/2023/008', amount: 350000, saecFees: 7000 },
      { no: 3, date: '2024-01-10', customer: 'JMC', woNo: 'WO/JMC/2023/008', amount: 200000, saecFees: 4000 },
    ],
    finalProgress: '100%', status: 'completed', completionCert: true,
  },
];

const statusCls: Record<string, string> = {
  active: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  hold: 'bg-amber-100 text-amber-700 border-amber-200',
};

const emptyForm = {
  projectName: '', workOrder: '', amount: '', securityDeposit: '',
  hoCoordinator: '', roCoordinator: '', l1: '', l2: '', l3: '', l4: '',
  loi: 'pending', agreement: 'pending',
};

export default function WIPPage() {
  const [projects, setProjects] = useState(mockWIP);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<typeof mockWIP[0] | null>(null);
  const [showRAModal, setShowRAModal] = useState<typeof mockWIP[0] | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [raForm, setRaForm] = useState({ date: '', customer: '', woNo: '', amount: '', saecFees: '', projectExp: '' });

  const filtered = projects.filter(p =>
    p.projectName.toLowerCase().includes(search.toLowerCase()) ||
    p.workOrder.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setProjects(prev => prev.map(p => p.id === editingId ? {
        ...p, projectName: form.projectName, workOrder: form.workOrder,
        amount: Number(form.amount), securityDeposit: Number(form.securityDeposit),
        hoCoordinator: form.hoCoordinator, roCoordinator: form.roCoordinator,
        l1: form.l1, l2: form.l2, l3: form.l3, l4: form.l4,
        loi: form.loi, agreement: form.agreement,
      } : p));
    } else {
      const newId = `WIP-${String(projects.length + 1).padStart(3, '0')}`;
      setProjects(prev => [...prev, {
        id: newId, projectName: form.projectName, loi: form.loi, agreement: form.agreement,
        workOrder: form.workOrder, amount: Number(form.amount), securityDeposit: Number(form.securityDeposit),
        hoCoordinator: form.hoCoordinator, roCoordinator: form.roCoordinator,
        l1: form.l1, l2: form.l2, l3: form.l3, l4: form.l4,
        raBills: [], finalProgress: '0%', status: 'active', completionCert: false,
      }]);
    }
    setShowModal(false); setEditingId(null); setForm({ ...emptyForm });
  };

  const addRABill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRAModal) return;
    const nextNo = (showRAModal.raBills.length + 1);
    const updated = { ...showRAModal, raBills: [...showRAModal.raBills, { no: nextNo, date: raForm.date, customer: raForm.customer, woNo: raForm.woNo, amount: Number(raForm.amount), saecFees: Number(raForm.saecFees) }] };
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setShowRAModal(updated);
    setRaForm({ date: '', customer: '', woNo: '', amount: '', saecFees: '', projectExp: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <HiOutlineClipboardList size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Work In Progress (WIP)</h1>
                <p className="text-sm text-slate-500">Manage active projects, RA bills & completion</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"><HiOutlineDownload size={18} /> Export</button>
              <button onClick={() => { setForm({ ...emptyForm }); setEditingId(null); setShowModal(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25">
                <HiOutlinePlus size={18} /> Add Project
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {wipStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color === 'blue' ? 'bg-blue-50 text-blue-600' : s.color === 'green' ? 'bg-green-50 text-green-600' : s.color === 'purple' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <s.icon size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="relative max-w-md">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search project or work order..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        {/* Project Cards */}
        <div className="space-y-4">
          {filtered.map(p => {
            const totalBilled = p.raBills.reduce((a, b) => a + b.amount, 0);
            const balance = p.amount - totalBilled;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-semibold text-slate-400">{p.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusCls[p.status]}`}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span>
                      {p.completionCert && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">3A Cert</span>}
                    </div>
                    <h3 className="font-semibold text-slate-900 text-lg mb-1">{p.projectName}</h3>
                    <p className="text-sm text-slate-500">{p.workOrder}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Work Order</p>
                      <p className="font-semibold text-slate-900">₹{(p.amount / 100000).toFixed(1)}L</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Billed</p>
                      <p className="font-semibold text-indigo-600">₹{(totalBilled / 100000).toFixed(1)}L</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Balance</p>
                      <p className="font-semibold text-slate-900">₹{(balance / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowDetail(p)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><HiOutlineEye size={18} /></button>
                    <button onClick={() => setShowRAModal(p)} className="px-3 py-2 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg hover:bg-indigo-100">+ RA Bill</button>
                    <button onClick={() => { setEditingId(p.id); setForm({ projectName: p.projectName, workOrder: p.workOrder, amount: String(p.amount), securityDeposit: String(p.securityDeposit), hoCoordinator: p.hoCoordinator, roCoordinator: p.roCoordinator, l1: p.l1, l2: p.l2, l3: p.l3, l4: p.l4, loi: p.loi, agreement: p.agreement }); setShowModal(true); }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><HiOutlinePencil size={18} /></button>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="px-6 pb-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Final Progress</span><span className="font-semibold text-slate-700">{p.finalProgress}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: p.finalProgress }} />
                  </div>
                  {/* RA Bills summary */}
                  {p.raBills.length > 0 && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {p.raBills.map(rb => (
                        <span key={rb.no} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                          RA {rb.no}: ₹{(rb.amount / 1000).toFixed(0)}K
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && <div className="py-16 text-center text-slate-400 bg-white rounded-xl border border-slate-200">No projects found</div>}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setShowModal(false); setEditingId(null); }} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">{editingId ? 'Edit Project' : 'Add WIP Project'}</h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><HiOutlineX size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Project Name *</label>
                <input required type="text" value={form.projectName} onChange={e => setForm(f => ({ ...f, projectName: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="As per tender" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Work Order No.</label>
                <input type="text" value={form.workOrder} onChange={e => setForm(f => ({ ...f, workOrder: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Amount of Work (₹)</label>
                <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Security Deposit (₹)</label>
                <input type="number" value={form.securityDeposit} onChange={e => setForm(f => ({ ...f, securityDeposit: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">LOI Status</label>
                <select value={form.loi} onChange={e => setForm(f => ({ ...f, loi: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="pending">Pending</option><option value="received">Received</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Agreement Status</label>
                <select value={form.agreement} onChange={e => setForm(f => ({ ...f, agreement: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="pending">Pending</option><option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">HO Coordinator</label>
                <input type="text" value={form.hoCoordinator} onChange={e => setForm(f => ({ ...f, hoCoordinator: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">RO Coordinator</label>
                <input type="text" value={form.roCoordinator} onChange={e => setForm(f => ({ ...f, roCoordinator: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              {[['L1', 'l1'], ['L2', 'l2'], ['L3', 'l3'], ['L4', 'l4']].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Staff {label}</label>
                  <input type="text" value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              ))}
              <div className="col-span-2 flex justify-end gap-3 pt-2 border-t border-slate-200">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); }} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/20">
                  {editingId ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* RA Bill Modal */}
      {showRAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowRAModal(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Add RA Bill</h2>
                <p className="text-xs text-slate-500">{showRAModal.projectName}</p>
              </div>
              <button onClick={() => setShowRAModal(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><HiOutlineX size={20} /></button>
            </div>
            <div className="p-6">
              {showRAModal.raBills.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Previous Bills</p>
                  <div className="space-y-1">
                    {showRAModal.raBills.map(rb => (
                      <div key={rb.no} className="flex justify-between text-sm p-2 bg-slate-50 rounded-lg">
                        <span className="text-slate-600">RA Bill #{rb.no} — {rb.date}</span>
                        <span className="font-medium text-slate-900">₹{rb.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <form onSubmit={addRABill} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Date *</label>
                    <input required type="date" value={raForm.date} onChange={e => setRaForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Customer</label>
                    <input type="text" value={raForm.customer} onChange={e => setRaForm(f => ({ ...f, customer: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">WO Number</label>
                    <input type="text" value={raForm.woNo} onChange={e => setRaForm(f => ({ ...f, woNo: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Amount (₹) *</label>
                    <input required type="number" value={raForm.amount} onChange={e => setRaForm(f => ({ ...f, amount: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">SAEC Fees (₹)</label>
                    <input type="number" value={raForm.saecFees} onChange={e => setRaForm(f => ({ ...f, saecFees: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Project Expense (₹)</label>
                    <input type="number" value={raForm.projectExp} onChange={e => setRaForm(f => ({ ...f, projectExp: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-3 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50">
                  <HiOutlineUpload size={18} className="mx-auto text-slate-400 mb-1" />
                  <p className="text-xs text-slate-500">Upload bill copy</p>
                </div>
                <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
                  <button type="button" onClick={() => setShowRAModal(null)} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-xl">Add RA Bill</button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
