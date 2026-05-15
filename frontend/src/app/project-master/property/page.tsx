'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineOfficeBuilding,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineUpload,
  HiOutlineDownload,
  HiOutlineFilter,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineTag,
  HiOutlineUserCircle,
} from 'react-icons/hi';

const propertyStats = [
  { label: 'Total Assets', value: '86', icon: HiOutlineOfficeBuilding, color: 'blue' },
  { label: 'Warranty Expiring', value: '5', icon: HiOutlineExclamationCircle, color: 'amber' },
  { label: 'Under Warranty', value: '34', icon: HiOutlineCheckCircle, color: 'green' },
  { label: 'Categories', value: '6', icon: HiOutlineTag, color: 'purple' },
];

const mockProperties = [
  { id: 'PROP-001', itemCode: 'ELE/AC/LG/001', securityCode: 'ELE/AC/LG/101', name: 'Air Conditioner', category: 'Electronics', make: 'LG', model: '1.5 Ton 5 Star', yearOfPurchase: '2022', qty: 3, warrantyTill: '2025-03-01', assignedTo: 'Mumbai HQ', responsiblePerson: 'Ketan Makadiya', status: 'active' },
  { id: 'PROP-002', itemCode: 'ELE/FAN/USH/002', securityCode: 'ELE/FAN/USH/102', name: 'Ceiling Fan', category: 'Electronics', make: 'Usha', model: 'Orient Aerostorm', yearOfPurchase: '2021', qty: 8, warrantyTill: '2023-06-01', assignedTo: 'Delhi Branch', responsiblePerson: 'Devang Lakhani', status: 'expired' },
  { id: 'PROP-003', itemCode: 'COMP/LAP/DEL/003', securityCode: 'COMP/LAP/DEL/103', name: 'Laptop', category: 'Computer', make: 'Dell', model: 'Inspiron 15', yearOfPurchase: '2023', qty: 5, warrantyTill: '2026-01-01', assignedTo: 'Mumbai HQ', responsiblePerson: 'Nikhil Davda', status: 'active' },
  { id: 'PROP-004', itemCode: 'FURN/CHR/HON/004', securityCode: 'FURN/CHR/HON/104', name: 'Office Chair', category: 'Furniture', make: 'Honeywell', model: 'Executive Series', yearOfPurchase: '2020', qty: 12, warrantyTill: '2023-12-01', assignedTo: 'Rajkot Branch', responsiblePerson: 'Ketan Makadiya', status: 'expired' },
  { id: 'PROP-005', itemCode: 'ELE/PROJ/EPS/005', securityCode: 'ELE/PROJ/EPS/105', name: 'Projector', category: 'Electronics', make: 'Epson', model: 'EB-X41', yearOfPurchase: '2023', qty: 2, warrantyTill: '2026-07-01', assignedTo: 'Conference Room', responsiblePerson: 'Devang Lakhani', status: 'active' },
];

const categories = ['All', 'Electronics', 'Computer', 'Furniture', 'Vehicle', 'Consumable', 'Other'];

const warrantyStatus = (till: string) => {
  const diff = Math.ceil((new Date(till).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: 'Expired', cls: 'bg-red-100 text-red-700 border-red-200' };
  if (diff <= 180) return { label: `${diff}d left`, cls: 'bg-amber-100 text-amber-700 border-amber-200' };
  return { label: 'Active', cls: 'bg-green-100 text-green-700 border-green-200' };
};

const emptyForm = {
  name: '', category: '', make: '', model: '', yearOfPurchase: '', qty: '1',
  warrantyTill: '', assignedTo: '', responsiblePerson: '', remarks: '',
};

export default function PropertyListPage() {
  const [properties, setProperties] = useState(mockProperties);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [viewItem, setViewItem] = useState<typeof mockProperties[0] | null>(null);

  const filtered = properties.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.make.toLowerCase().includes(search.toLowerCase()) ||
      p.assignedTo.toLowerCase().includes(search.toLowerCase()) ||
      p.responsiblePerson.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setProperties(prev => prev.map(p => p.id === editingId ? {
        ...p, name: form.name, category: form.category, make: form.make, model: form.model,
        yearOfPurchase: form.yearOfPurchase, qty: Number(form.qty),
        warrantyTill: form.warrantyTill, assignedTo: form.assignedTo,
        responsiblePerson: form.responsiblePerson,
        status: new Date(form.warrantyTill) > new Date() ? 'active' : 'expired',
      } : p));
    } else {
      const newIdx = properties.length + 1;
      const catCode = form.category.slice(0, 4).toUpperCase();
      const newId = `PROP-${String(newIdx).padStart(3, '0')}`;
      const itemCode = `${catCode}/${form.name.slice(0, 3).toUpperCase()}/${form.make.slice(0, 3).toUpperCase()}/${String(newIdx).padStart(3, '0')}`;
      const secCode = `${catCode}/${form.name.slice(0, 3).toUpperCase()}/${form.make.slice(0, 3).toUpperCase()}/${newIdx}`;
      setProperties(prev => [...prev, {
        id: newId, itemCode, name: form.name, category: form.category, make: form.make, model: form.model,
        yearOfPurchase: form.yearOfPurchase, qty: Number(form.qty), securityCode: secCode,
        warrantyTill: form.warrantyTill, assignedTo: form.assignedTo,
        responsiblePerson: form.responsiblePerson,
        status: form.warrantyTill && new Date(form.warrantyTill) > new Date() ? 'active' : 'expired',
      }]);
    }
    setShowModal(false); setEditingId(null); setForm({ ...emptyForm });
  };

  const openEdit = (p: typeof mockProperties[0]) => {
    setEditingId(p.id);
    setForm({ name: p.name, category: p.category, make: p.make, model: p.model, yearOfPurchase: p.yearOfPurchase, qty: String(p.qty), warrantyTill: p.warrantyTill, assignedTo: p.assignedTo, responsiblePerson: p.responsiblePerson, remarks: '' });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <HiOutlineOfficeBuilding size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Property List</h1>
                <p className="text-sm text-slate-500">Track assets, warranties, assignments & service reminders</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"><HiOutlineDownload size={18} /> Export</button>
              <button onClick={() => { setForm({ ...emptyForm }); setEditingId(null); setShowModal(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-xl hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25">
                <HiOutlinePlus size={18} /> Add Asset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {propertyStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{s.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color === 'blue' ? 'bg-blue-50 text-blue-600' : s.color === 'amber' ? 'bg-amber-50 text-amber-600' : s.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'}`}>
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search asset name, make, assigned to..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${catFilter === c ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Asset', 'Category', 'Make / Model', 'Year', 'Qty', 'Assigned To', 'Warranty', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 first:px-6 last:px-6 last:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(p => {
                  const ws = warrantyStatus(p.warrantyTill);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900 text-sm">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.itemCode}</p>
                      </td>
                      <td className="px-4 py-4"><span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">{p.category}</span></td>
                      <td className="px-4 py-4 text-sm text-slate-700">{p.make} / {p.model}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{p.yearOfPurchase}</td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">{p.qty}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-slate-700">
                          <HiOutlineUserCircle size={14} className="text-slate-400" />{p.assignedTo}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{p.responsiblePerson}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${ws.cls}`}>{ws.label}</span>
                        <p className="text-xs text-slate-400 mt-0.5">Till {p.warrantyTill}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setViewItem(p)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"><HiOutlineEye size={16} /></button>
                          <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><HiOutlinePencil size={16} /></button>
                          <button onClick={() => setProperties(prev => prev.filter(x => x.id !== p.id))} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><HiOutlineTrash size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && <tr><td colSpan={8} className="py-16 text-center text-slate-400">No assets found</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
            Showing {filtered.length} of {properties.length} assets
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
              <h2 className="font-bold text-slate-900 text-lg">{editingId ? 'Edit Asset' : 'Add New Asset'}</h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><HiOutlineX size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Asset Name *</label>
                <input required type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Air Conditioner" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category *</label>
                <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="">Select</option>
                  {['Electronics', 'Computer', 'Furniture', 'Vehicle', 'Consumable', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Make / Brand</label>
                <input type="text" value={form.make} onChange={e => setForm(f => ({ ...f, make: e.target.value }))} placeholder="e.g. LG, Samsung" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Model</label>
                <input type="text" value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Year of Purchase</label>
                <input type="number" value={form.yearOfPurchase} onChange={e => setForm(f => ({ ...f, yearOfPurchase: e.target.value }))} placeholder="e.g. 2023" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity</label>
                <input type="number" min="1" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Warranty Valid Till</label>
                <input type="date" value={form.warrantyTill} onChange={e => setForm(f => ({ ...f, warrantyTill: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Assigned To</label>
                <input type="text" value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} placeholder="Office / Person" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Responsible Person</label>
                <input type="text" value={form.responsiblePerson} onChange={e => setForm(f => ({ ...f, responsiblePerson: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Upload Bill / Warranty Copy</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-colors">
                  <HiOutlineUpload size={20} className="mx-auto text-slate-400 mb-1" />
                  <p className="text-xs text-slate-500">Click to upload scanned bill/warranty</p>
                </div>
              </div>
              <div className="col-span-2 flex justify-end gap-3 pt-2 border-t border-slate-200">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); }} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/20">
                  {editingId ? 'Save Changes' : 'Add Asset'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Asset Details</h2>
              <button onClick={() => setViewItem(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><HiOutlineX size={20} /></button>
            </div>
            <div className="p-6 space-y-2.5 text-sm">
              {[
                ['Item Code', viewItem.itemCode], ['Security Code', viewItem.securityCode],
                ['Asset Name', viewItem.name], ['Category', viewItem.category],
                ['Make', viewItem.make], ['Model', viewItem.model],
                ['Year of Purchase', viewItem.yearOfPurchase], ['Quantity', String(viewItem.qty)],
                ['Warranty Till', viewItem.warrantyTill], ['Assigned To', viewItem.assignedTo],
                ['Responsible Person', viewItem.responsiblePerson],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-medium">{k}</span>
                  <span className="text-slate-900">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
