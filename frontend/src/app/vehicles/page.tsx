'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { Vehicle } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch, HiOutlineDocument } from 'react-icons/hi';
import { format } from 'date-fns';

const vehicleTypes = ['sedan', 'suv', 'hatchback', 'van', 'bus', 'truck', 'other'];
const fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid', 'cng'];

export default function VehiclesPage() {
  const { t } = useLanguage();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [search, setSearch] = useState('');
  
  // Maintenance Expense Flow
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [maintenanceAmount, setMaintenanceAmount] = useState('');
  const [maintenanceDesc, setMaintenanceDesc] = useState('Routine Maintenance');
  const [maintenanceFile, setMaintenanceFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    vehicleNumber: '', model: '', type: 'sedan', year: '', color: '', fuelType: 'petrol', status: 'active',
    insuranceEndDate: '', pucEndDate: '',
  });
  const [docs, setDocs] = useState<{rcBook: File | null, insurance: File | null, puc: File | null}>({
    rcBook: null, insurance: null, puc: null
  });

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles', { params: { search } });
      setVehicles(res.data);
    } catch { toast.error(t('vehicles.toast.loadFailed')); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVehicles(); }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Intercept transition from Maintenance -> Active
      if (editingVehicle && editingVehicle.status === 'maintenance' && form.status === 'active') {
        setIsModalOpen(false);
        setIsMaintenanceModalOpen(true);
        return; // Pause the update until maintenance expense is logged
      }

      await executeSubmit(form);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const executeSubmit = async (finalForm: any) => {
    try {
      const formData = new FormData();
      Object.entries(finalForm).forEach(([key, value]) => {
        if (value) formData.append(key, value as string);
      });
      if (docs.rcBook) formData.append('rcBook', docs.rcBook);
      if (docs.insurance) formData.append('insurance', docs.insurance);
      if (docs.puc) formData.append('puc', docs.puc);

      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(t('vehicles.toast.updated'));
      } else {
        await api.post('/vehicles', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(t('vehicles.toast.added'));
      }
      setIsModalOpen(false);
      resetForm();
      fetchVehicles();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    try {
      // 1. Submit the expense to /api/expenses
      const expenseData = new FormData();
      expenseData.append('vehicleId', editingVehicle._id);
      expenseData.append('type', 'maintenance');
      expenseData.append('amount', maintenanceAmount);
      expenseData.append('description', maintenanceDesc);
      if (maintenanceFile) {
        expenseData.append('billImage', maintenanceFile);
      }

      await api.post('/expenses', expenseData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 2. Now finally execute the vehicle update to "active"
      await executeSubmit({ ...form, status: 'active' });
      
      toast.success(t('vehicles.toast.maintenanceLogged'));
      setIsMaintenanceModalOpen(false);
      setMaintenanceAmount('');
      setMaintenanceDesc('Routine Maintenance');
      setMaintenanceFile(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || t('vehicles.toast.maintenanceFailed'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('vehicles.confirmDelete'))) return;
    try {
      await api.delete(`/vehicles/${id}`);
      toast.success(t('vehicles.toast.deleted'));
      fetchVehicles();
    } catch { toast.error(t('vehicles.toast.failed')); }
  };

  const resetForm = () => {
    setForm({ 
      vehicleNumber: '', model: '', type: 'sedan', year: '', color: '', fuelType: 'petrol', status: 'active',
      insuranceEndDate: '', pucEndDate: '',
    });
    setDocs({ rcBook: null, insurance: null, puc: null });
    setEditingVehicle(null);
  };

  const openEditModal = (vehicle: Vehicle & { rcBookUrl?: string, insuranceUrl?: string, pucUrl?: string }) => {
    setEditingVehicle(vehicle);
    setForm({
      vehicleNumber: vehicle.vehicleNumber, model: vehicle.model, type: vehicle.type,
      year: vehicle.year?.toString() || '', color: vehicle.color || '', fuelType: vehicle.fuelType || 'petrol', status: vehicle.status,
      insuranceEndDate: vehicle.insuranceEndDate?.split('T')[0] || '',
      pucEndDate: vehicle.pucEndDate?.split('T')[0] || '',
    });
    setDocs({ rcBook: null, insurance: null, puc: null });
    setIsModalOpen(true);
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">{t('vehicles.title')}</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="btn btn-primary">
          <HiOutlinePlus size={18} /> {t('vehicles.addBtn')}
        </button>
      </div>

      <div className="card mb-6 p-4">
        <div className="relative">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('vehicles.searchPlaceholder')} className="form-input pl-11" />
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12"><div className="spinner" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>{t('vehicles.table.number')}</th><th>{t('vehicles.table.model')}</th><th>{t('vehicles.table.type')}</th><th>{t('vehicles.table.fuel')}</th><th>{t('vehicles.table.docs')}</th><th>{t('vehicles.table.status')}</th><th>{t('vehicles.table.actions')}</th></tr></thead>
              <tbody>
                {vehicles.length > 0 ? vehicles.map((v: any) => (
                  <tr key={v._id}>
                    <td className="font-semibold text-slate-800">{v.vehicleNumber}</td>
                    <td>{v.model}</td>
                    <td className="capitalize">{v.type}</td>
                    <td className="capitalize">{v.fuelType || '-'}</td>
                    <td>
                      <div className="flex flex-col gap-1 text-xs">
                        {v.rcBookUrl ? (
                          <a href={v.rcBookUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                            <HiOutlineDocument /> {t('vehicles.table.rc')}
                          </a>
                        ) : <span className="text-slate-400">{t('vehicles.docs.noRC')}</span>}
                        {v.insuranceUrl ? (
                          <a href={v.insuranceUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                            <HiOutlineDocument /> {t('vehicles.table.insurance')} {v.insuranceEndDate && <span className="text-[10px] text-orange-500 ml-1">({format(new Date(v.insuranceEndDate), 'dd/MM/yy')})</span>}
                          </a>
                        ) : <span className="text-slate-400">{t('vehicles.docs.noInsurance')}</span>}
                        {v.pucUrl ? (
                          <a href={v.pucUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                            <HiOutlineDocument /> {t('vehicles.table.puc')} {v.pucEndDate && <span className="text-[10px] text-orange-500 ml-1">({format(new Date(v.pucEndDate), 'dd/MM/yy')})</span>}
                          </a>
                        ) : <span className="text-slate-400">{t('vehicles.docs.noPUC')}</span>}
                      </div>
                    </td>
                    <td><StatusBadge status={v.status} /></td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(v)} className="btn btn-secondary btn-sm"><HiOutlinePencil size={14} /></button>
                        <button onClick={() => handleDelete(v._id)} className="btn btn-danger btn-sm"><HiOutlineTrash size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="text-center py-8 text-slate-400">{t('vehicles.noVehicles')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingVehicle ? t('vehicles.form.editTitle') : t('vehicles.form.addTitle')} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="form-label">{t('vehicles.form.number')} *</label><input value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} className="form-input" required /></div>
            <div><label className="form-label">{t('vehicles.form.model')} *</label><input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="form-input" required /></div>
            <div><label className="form-label">{t('vehicles.form.type')} *</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="form-select">{vehicleTypes.map(t_val => <option key={t_val} value={t_val}>{t_val.charAt(0).toUpperCase() + t_val.slice(1)}</option>)}</select></div>
            <div><label className="form-label">{t('vehicles.form.fuel')} *</label><select value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })} className="form-select">{fuelTypes.map(t_val => <option key={t_val} value={t_val}>{t_val.charAt(0).toUpperCase() + t_val.slice(1)}</option>)}</select></div>
            <div><label className="form-label">{t('vehicles.form.year')}</label><input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="form-input" /></div>
            <div><label className="form-label">{t('vehicles.form.color')}</label><input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="form-input" /></div>
            <div><label className="form-label">{t('vehicles.form.status')}</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="form-select"><option value="active">{t('trips.active')}</option><option value="inactive">Inactive</option><option value="maintenance">Maintenance</option></select></div>

            {/* Document Uploads & Expiry Dates */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">{t('vehicles.docs.title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="form-label text-xs">{t('vehicles.docs.rc')}</label>
                  <input type="file" accept="image/*" onChange={(e) => setDocs({ ...docs, rcBook: e.target.files?.[0] || null })} className="form-input text-sm p-1" />
                </div>
                <div className="space-y-2">
                  <label className="form-label text-xs">{t('vehicles.docs.insurance')}</label>
                  <input type="file" accept="image/*" onChange={(e) => setDocs({ ...docs, insurance: e.target.files?.[0] || null })} className="form-input text-sm p-1" />
                  <label className="form-label text-xs mt-1">{t('vehicles.docs.insuranceExp')}</label>
                  <input type="date" value={form.insuranceEndDate} onChange={(e) => setForm({ ...form, insuranceEndDate: e.target.value })} className="form-input text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="form-label text-xs">{t('vehicles.docs.puc')}</label>
                  <input type="file" accept="image/*" onChange={(e) => setDocs({ ...docs, puc: e.target.files?.[0] || null })} className="form-input text-sm p-1" />
                  <label className="form-label text-xs mt-1">{t('vehicles.docs.pucExp')}</label>
                  <input type="date" value={form.pucEndDate} onChange={(e) => setForm({ ...form, pucEndDate: e.target.value })} className="form-input text-sm" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn btn-primary">{editingVehicle ? t('common.update') : t('common.add')} {t('nav.vehicles').slice(0, -1)}</button>
            <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="btn btn-secondary">{t('common.cancel')}</button>
          </div>
        </form>
      </Modal>

      {/* Maintenance Expense Modal */}
      <Modal isOpen={isMaintenanceModalOpen} onClose={() => setIsMaintenanceModalOpen(false)} title={t('vehicles.maintenance.modalTitle')} size="md">
        <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm mb-4">
            {t('vehicles.maintenance.info')}
          </div>
          
          <div>
            <label className="form-label">{t('vehicles.maintenance.amount')} *</label>
            <input type="number" value={maintenanceAmount} onChange={(e) => setMaintenanceAmount(e.target.value)} className="form-input" required min="0" />
          </div>
          
          <div>
            <label className="form-label">{t('vehicles.maintenance.desc')}</label>
            <input type="text" value={maintenanceDesc} onChange={(e) => setMaintenanceDesc(e.target.value)} className="form-input" required />
          </div>

          <div>
            <label className="form-label">{t('vehicles.maintenance.bill')}</label>
            <input type="file" accept="image/*" onChange={(e) => setMaintenanceFile(e.target.files?.[0] || null)} className="form-input p-1" />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn btn-primary">{t('vehicles.maintenance.saveBtn')}</button>
            <button type="button" onClick={() => setIsMaintenanceModalOpen(false)} className="btn btn-secondary">{t('common.cancel')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
