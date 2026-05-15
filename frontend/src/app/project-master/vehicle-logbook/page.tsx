'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineTruck,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineX,
  HiOutlineUpload,
  HiOutlineDownload,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineUserCircle,
  HiOutlineCurrencyRupee,
  HiOutlineFilter,
  HiOutlineChartBar,
} from 'react-icons/hi';

const logStats = [
  { label: 'Total Trips', value: '248', icon: HiOutlineTruck, color: 'blue' },
  { label: 'Total KM', value: '18,420', icon: HiOutlineChartBar, color: 'indigo' },
  { label: 'Fuel Expense', value: '₹1.2L', icon: HiOutlineCurrencyRupee, color: 'amber' },
  { label: 'Pending Approval', value: '4', icon: HiOutlineClock, color: 'rose' },
];

const vehicles = ['All', 'Maruti Wagon R', 'Honda Activa', 'Bajaj Boxer'];
const staffList = ['Ketan Makadiya', 'Devang Lakhani', 'Nikhil Davda'];
const purposeList = ['Gujarat Police Housing', 'Rajkot Municipal Corp', 'Kalawad Panchayat', 'Site Visit', 'New Business'];

const mockLogs = [
  {
    id: 'VLB-001', date: '2024-01-15', vehicle: 'Maruti Wagon R', tourFrom: 'Rajkot', tourTo: 'Gondal',
    startKm: 12500, endKm: 12700, totalKm: 200, person: 'Ketan Makadiya',
    purpose: 'Gujarat Police Housing', fuelAmt: 450, serviceParticular: '', serviceAmt: 0,
    maintenanceParticular: '', maintenanceAmt: 0, tax: 0, remarks: '', approvedBy: 'Ketan Makadiya',
    approvalStatus: 'approved',
  },
  {
    id: 'VLB-002', date: '2024-01-16', vehicle: 'Honda Activa', tourFrom: 'Rajkot', tourTo: 'Kalawad',
    startKm: 8200, endKm: 8342, totalKm: 142, person: 'Devang Lakhani',
    purpose: 'Kalawad Panchayat', fuelAmt: 250, serviceParticular: 'Oil change', serviceAmt: 350,
    maintenanceParticular: '', maintenanceAmt: 0, tax: 0, remarks: 'Chain lubrication done', approvedBy: 'Ketan Makadiya',
    approvalStatus: 'approved',
  },
  {
    id: 'VLB-003', date: '2024-01-18', vehicle: 'Maruti Wagon R', tourFrom: 'Rajkot', tourTo: 'Jamnagar',
    startKm: 12700, endKm: 13015, totalKm: 315, person: 'Nikhil Davda',
    purpose: 'New Business', fuelAmt: 700, serviceParticular: '', serviceAmt: 0,
    maintenanceParticular: 'Tyre pressure', maintenanceAmt: 50, tax: 0, remarks: '', approvedBy: '',
    approvalStatus: 'pending',
  },
  {
    id: 'VLB-004', date: '2024-01-20', vehicle: 'Bajaj Boxer', tourFrom: 'Rajkot', tourTo: 'Morbi',
    startKm: 5100, endKm: 5212, totalKm: 112, person: 'Ketan Makadiya',
    purpose: 'Rajkot Municipal Corp', fuelAmt: 180, serviceParticular: '', serviceAmt: 0,
    maintenanceParticular: '', maintenanceAmt: 0, tax: 0, remarks: '', approvedBy: '',
    approvalStatus: 'pending',
  },
];

const approvalCls: Record<string, string> = {
  approved: 'bg-green-100 text-green-700 border-green-200',
  pending:  'bg-amber-100 text-amber-700 border-amber-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

const emptyForm = {
  date: '', vehicle: '', tourFrom: '', tourTo: '', startKm: '', endKm: '',
  person: '', purpose: '', fuelAmt: '', serviceParticular: '', serviceAmt: '',
  maintenanceParticular: '', maintenanceAmt: '', tax: '', remarks: '', approvedBy: '',
};

export default function VehicleLogbookPage() {
  const [logs, setLogs] = useState(mockLogs);
  const [search, setSearch] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [viewLog, setViewLog] = useState<typeof mockLogs[0] | null>(null);

  const filtered = logs.filter(l => {
    const matchSearch =
      l.person.toLowerCase().includes(search.toLowerCase()) ||
      l.purpose.toLowerCase().includes(search.toLowerCase()) ||
      l.tourTo.toLowerCase().includes(search.toLowerCase());
    const matchVehicle = vehicleFilter === 'All' || l.vehicle === vehicleFilter;
    return matchSearch && matchVehicle;
  });

  const totalKm = filtered.reduce((a, b) => a + b.totalKm, 0);
  const totalFuel = filtered.reduce((a, b) => a + b.fuelAmt, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startKm = Number(form.startKm);
    const endKm = Number(form.endKm);
    const totalKm = endKm - startKm;
    if (editingId) {
      setLogs(prev => prev.map(l => l.id === editingId ? {
        ...l, date: form.date, vehicle: form.vehicle, tourFrom: form.tourFrom, tourTo: form.tourTo,
        startKm, endKm, totalKm, person: form.person, purpose: form.purpose,
        fuelAmt: Number(form.fuelAmt), serviceParticular: form.serviceParticular, serviceAmt: Number(form.serviceAmt),
        maintenanceParticular: form.maintenanceParticular, maintenanceAmt: Number(form.maintenanceAmt),
        tax: Number(form.tax), remarks: form.remarks, approvedBy: form.approvedBy,
        approvalStatus: form.approvedBy ? 'approved' : 'pending',
      } : l));
    } else {
      const newId = `VLB-${String(logs.length + 1).padStart(3, '0')}`;
      setLogs(prev => [...prev, {
        id: newId, date: form.date, vehicle: form.vehicle, tourFrom: form.tourFrom, tourTo: form.tourTo,
        startKm, endKm, totalKm, person: form.person, purpose: form.purpose,
        fuelAmt: Number(form.fuelAmt), serviceParticular: form.serviceParticular, serviceAmt: Number(form.serviceAmt),
        maintenanceParticular: form.maintenanceParticular, maintenanceAmt: Number(form.maintenanceAmt),
        tax: Number(form.tax), remarks: form.remarks, approvedBy: form.approvedBy,
        approvalStatus: form.approvedBy ? 'approved' : 'pending',
      }]);
    }
    setShowModal(false); setEditingId(null); setForm({ ...emptyForm });
  };

  const openEdit = (l: typeof mockLogs[0]) => {
    setEditingId(l.id);
    setForm({
      date: l.date, vehicle: l.vehicle, tourFrom: l.tourFrom, tourTo: l.tourTo,
      startKm: String(l.startKm), endKm: String(l.endKm), person: l.person, purpose: l.purpose,
      fuelAmt: String(l.fuelAmt), serviceParticular: l.serviceParticular, serviceAmt: String(l.serviceAmt),
      maintenanceParticular: l.maintenanceParticular, maintenanceAmt: String(l.maintenanceAmt),
      tax: String(l.tax), remarks: l.remarks, approvedBy: l.approvedBy,
    });
    setShowModal(true);
  };

  const approveLog = (id: string) => {
    setLogs(prev => prev.map(l => l.id === id ? { ...l, approvalStatus: 'approved', approvedBy: 'Ketan Makadiya' } : l));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <HiOutlineTruck size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Vehicle Log Book</h1>
                <p className="text-sm text-slate-500">Track trips, KM, fuel, service & maintenance per vehicle</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50">
                <HiOutlineDownload size={18} /> Export
              </button>
              <button
                onClick={() => { setForm({ ...emptyForm }); setEditingId(null); setShowModal(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/25"
              >
                <HiOutlinePlus size={18} /> Add Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {logStats.map((s, i) => (
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
                  'bg-rose-50 text-rose-600'
                }`}>
                  <s.icon size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary for filtered */}
        {(vehicleFilter !== 'All' || search) && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 flex items-center gap-3">
              <HiOutlineChartBar size={20} className="text-cyan-600" />
              <div>
                <p className="text-xs text-cyan-600 font-medium">Filtered Total KM</p>
                <p className="text-xl font-bold text-cyan-800">{totalKm.toLocaleString()} km</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
              <HiOutlineCurrencyRupee size={20} className="text-amber-600" />
              <div>
                <p className="text-xs text-amber-600 font-medium">Filtered Fuel Expense</p>
                <p className="text-xl font-bold text-amber-800">₹{totalFuel.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search person, purpose, destination..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <select value={vehicleFilter} onChange={e => setVehicleFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
            {vehicles.map(v => <option key={v}>{v}</option>)}
          </select>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Date / Vehicle', 'Route', 'Person', 'KM', 'Purpose', 'Expenses', 'Approval', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 first:px-6 last:px-6 last:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(l => {
                  const totalExp = l.fuelAmt + l.serviceAmt + l.maintenanceAmt + l.tax;
                  return (
                    <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-700 mb-1">
                          <HiOutlineCalendar size={13} className="text-slate-400" />{l.date}
                        </div>
                        <p className="text-xs font-medium text-slate-900">{l.vehicle}</p>
                        <p className="text-xs text-slate-400">{l.id}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-slate-700">
                          <HiOutlineLocationMarker size={13} className="text-slate-400" />
                          {l.tourFrom} → {l.tourTo}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-slate-700">
                          <HiOutlineUserCircle size={14} className="text-slate-400" />{l.person}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-slate-900">{l.totalKm} km</p>
                        <p className="text-xs text-slate-400">{l.startKm} → {l.endKm}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700 max-w-[120px]">
                        <p className="truncate">{l.purpose}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-slate-900">₹{totalExp.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Fuel: ₹{l.fuelAmt}</p>
                        {l.serviceAmt > 0 && <p className="text-xs text-slate-400">Svc: ₹{l.serviceAmt}</p>}
                        {l.maintenanceAmt > 0 && <p className="text-xs text-slate-400">Maint: ₹{l.maintenanceAmt}</p>}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${approvalCls[l.approvalStatus]}`}>
                          {l.approvalStatus.charAt(0).toUpperCase() + l.approvalStatus.slice(1)}
                        </span>
                        {l.approvedBy && <p className="text-xs text-slate-400 mt-0.5">{l.approvedBy.split(' ')[0]}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setViewLog(l)} className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg"><HiOutlineEye size={16} /></button>
                          <button onClick={() => openEdit(l)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><HiOutlinePencil size={16} /></button>
                          {l.approvalStatus === 'pending' && (
                            <button onClick={() => approveLog(l.id)} className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                              <HiOutlineCheckCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="py-16 text-center text-slate-400">No log entries found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
            Showing {filtered.length} of {logs.length} entries
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
              <h2 className="font-bold text-slate-900 text-lg">{editingId ? 'Edit Log Entry' : 'Add Log Entry'}</h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); }} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><HiOutlineX size={22} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Date *</label>
                <input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Vehicle *</label>
                <select required value={form.vehicle} onChange={e => setForm(f => ({ ...f, vehicle: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none">
                  <option value="">Select</option>
                  {['Maruti Wagon R', 'Honda Activa', 'Bajaj Boxer'].map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tour From</label>
                <input type="text" value={form.tourFrom} onChange={e => setForm(f => ({ ...f, tourFrom: e.target.value }))} placeholder="e.g. Rajkot" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tour To</label>
                <input type="text" value={form.tourTo} onChange={e => setForm(f => ({ ...f, tourTo: e.target.value }))} placeholder="e.g. Gondal" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Start KM *</label>
                <input required type="number" value={form.startKm} onChange={e => setForm(f => ({ ...f, startKm: e.target.value }))} placeholder="Upload odometer photo" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">End KM *</label>
                <input required type="number" value={form.endKm} onChange={e => setForm(f => ({ ...f, endKm: e.target.value }))} placeholder="Upload odometer photo" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              {form.startKm && form.endKm && (
                <div className="col-span-2 bg-cyan-50 border border-cyan-200 rounded-lg px-4 py-2 text-sm font-medium text-cyan-700">
                  Total KM: {Math.max(0, Number(form.endKm) - Number(form.startKm))} km
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Person Travelling *</label>
                <select required value={form.person} onChange={e => setForm(f => ({ ...f, person: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none">
                  <option value="">Select</option>
                  {staffList.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Purpose of Travel</label>
                <select value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none">
                  <option value="">Select</option>
                  {purposeList.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Fuel Amount (₹)</label>
                <input type="number" value={form.fuelAmt} onChange={e => setForm(f => ({ ...f, fuelAmt: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tax (₹)</label>
                <input type="number" value={form.tax} onChange={e => setForm(f => ({ ...f, tax: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Service Particular</label>
                <input type="text" value={form.serviceParticular} onChange={e => setForm(f => ({ ...f, serviceParticular: e.target.value }))} placeholder="e.g. Oil change" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Service Amount (₹)</label>
                <input type="number" value={form.serviceAmt} onChange={e => setForm(f => ({ ...f, serviceAmt: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Maintenance Particular</label>
                <input type="text" value={form.maintenanceParticular} onChange={e => setForm(f => ({ ...f, maintenanceParticular: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Maintenance Amount (₹)</label>
                <input type="number" value={form.maintenanceAmt} onChange={e => setForm(f => ({ ...f, maintenanceAmt: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Approved By</label>
                <select value={form.approvedBy} onChange={e => setForm(f => ({ ...f, approvedBy: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none">
                  <option value="">Pending Approval</option>
                  {staffList.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Remarks</label>
                <input type="text" value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Upload Petrol Bill / Odometer Photo</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-50 transition-colors">
                  <HiOutlineUpload size={20} className="mx-auto text-slate-400 mb-1" />
                  <p className="text-xs text-slate-500">Upload bill receipts & odometer photos</p>
                </div>
              </div>
              <div className="col-span-2 flex justify-end gap-3 pt-2 border-t border-slate-200">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); }} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-cyan-500/20">
                  {editingId ? 'Save Changes' : 'Add Entry'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* View Modal */}
      {viewLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewLog(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white">
              <h2 className="font-bold text-slate-900">Log Entry – {viewLog.id}</h2>
              <button onClick={() => setViewLog(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"><HiOutlineX size={20} /></button>
            </div>
            <div className="p-6 space-y-2.5 text-sm">
              {([
                ['Date', viewLog.date], ['Vehicle', viewLog.vehicle],
                ['Route', `${viewLog.tourFrom} → ${viewLog.tourTo}`],
                ['Person', viewLog.person], ['Purpose', viewLog.purpose],
                ['Start KM', String(viewLog.startKm)], ['End KM', String(viewLog.endKm)],
                ['Total KM', `${viewLog.totalKm} km`],
                ['Fuel Amount', `₹${viewLog.fuelAmt}`],
                ['Service', viewLog.serviceParticular || '-'],
                ['Service Amount', viewLog.serviceAmt > 0 ? `₹${viewLog.serviceAmt}` : '-'],
                ['Maintenance', viewLog.maintenanceParticular || '-'],
                ['Maintenance Amount', viewLog.maintenanceAmt > 0 ? `₹${viewLog.maintenanceAmt}` : '-'],
                ['Tax', viewLog.tax > 0 ? `₹${viewLog.tax}` : '-'],
                ['Total Expense', `₹${viewLog.fuelAmt + viewLog.serviceAmt + viewLog.maintenanceAmt + viewLog.tax}`],
                ['Approved By', viewLog.approvedBy || 'Pending'],
                ['Approval Status', viewLog.approvalStatus.toUpperCase()],
                ['Remarks', viewLog.remarks || '-'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-medium">{k}</span>
                  <span className="text-slate-900 text-right max-w-[200px]">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
