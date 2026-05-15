'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { Driver } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch, HiOutlineDocument, HiOutlineUser } from 'react-icons/hi';
import { format } from 'date-fns';

export default function DriversPage() {
  const { t } = useLanguage();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', phone: '', email: '', licenseNumber: '', licenseExpiry: '', address: '', password: '',
  });
  const [docs, setDocs] = useState<{license: File | null, aadhar: File | null, profile: File | null}>({
    license: null, aadhar: null, profile: null
  });

  const fetchDrivers = async () => {
    try {
      const res = await api.get('/drivers', { params: { search } });
      setDrivers(res.data);
    } catch { toast.error(t('drivers.toast.loadFailed')); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDrivers(); }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (docs.license) formData.append('licenseDocument', docs.license);
      if (docs.aadhar) formData.append('aadharDocument', docs.aadhar);
      if (docs.profile) formData.append('profileImage', docs.profile);

      if (editingDriver) {
        await api.put(`/drivers/${editingDriver._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(t('drivers.toast.updated'));
      } else {
        await api.post('/drivers', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(t('drivers.toast.added'));
      }
      setIsModalOpen(false);
      resetForm();
      fetchDrivers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('drivers.confirmDelete'))) return;
    try {
      await api.delete(`/drivers/${id}`);
      toast.success(t('drivers.toast.deleted'));
      fetchDrivers();
    } catch { toast.error(t('drivers.toast.failed')); }
  };

  const resetForm = () => {
    setForm({ name: '', phone: '', email: '', licenseNumber: '', licenseExpiry: '', address: '', password: '' });
    setDocs({ license: null, aadhar: null, profile: null });
    setEditingDriver(null);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setForm({
      name: driver.name, phone: driver.phone, email: driver.email || '',
      licenseNumber: driver.licenseNumber, 
      licenseExpiry: driver.licenseExpiry?.split('T')[0] || '',
      address: driver.address || '', password: '',
    });
    setDocs({ license: null, aadhar: null, profile: null });
    setIsModalOpen(true);
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">{t('drivers.title')}</h1>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="btn btn-primary">
          <HiOutlinePlus size={18} /> {t('drivers.addBtn')}
        </button>
      </div>

      <div className="card mb-6 p-4">
        <div className="relative">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('drivers.searchPlaceholder')} className="form-input pl-11" />
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12"><div className="spinner" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>{t('drivers.table.driver')}</th><th>{t('drivers.table.contact')}</th><th>{t('drivers.table.license')}</th><th>{t('drivers.table.status')}</th><th>{t('drivers.table.documents')}</th><th>{t('common.actions')}</th></tr></thead>
              <tbody>
                {drivers.length > 0 ? drivers.map((d: any) => (
                  <tr key={d._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {d.profileImage ? (
                          <img src={d.profileImage} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <HiOutlineUser size={20} />
                          </div>
                        )}
                        <span className="font-semibold text-slate-800">{d.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">{d.phone}</div>
                      <div className="text-xs text-slate-500">{d.email || '-'}</div>
                    </td>
                    <td>
                      <div className="text-sm font-medium">{d.licenseNumber}</div>
                      <div className="text-xs text-slate-500">{t('drivers.table.exp')} {d.licenseExpiry ? format(new Date(d.licenseExpiry), 'dd MMM yyyy') : '-'}</div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        {d.isActive ? (
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full w-fit font-bold">{t('drivers.status.available')}</span>
                        ) : (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full w-fit font-bold uppercase">{t('drivers.status.notAvailable')}</span>
                            {d.inactiveReason && <div className="text-[10px] text-red-500 italic max-w-[150px] leading-tight">{t('drivers.status.reason')}: {d.inactiveReason}</div>}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1 text-xs">
                        {d.licenseDocumentUrl ? (
                          <a href={d.licenseDocumentUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                            <HiOutlineDocument /> {t('drivers.table.license')}
                          </a>
                        ) : <span className="text-slate-400">{t('drivers.docs.noDoc')}</span>}
                        {d.aadharDocumentUrl ? (
                          <a href={d.aadharDocumentUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                            <HiOutlineDocument /> Aadhar
                          </a>
                        ) : <span className="text-slate-400">{t('drivers.docs.noDoc')}</span>}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(d)} className="btn btn-secondary btn-sm"><HiOutlinePencil size={14} /></button>
                        <button onClick={() => handleDelete(d._id)} className="btn btn-danger btn-sm"><HiOutlineTrash size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-400">{t('drivers.noDrivers')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingDriver ? t('drivers.form.editTitle') : t('drivers.form.addTitle')} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="form-label">{t('drivers.form.fullName')} *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="form-input" required /></div>
            <div><label className="form-label">{t('drivers.form.phone')} *</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-input" required /></div>
            <div><label className="form-label">{t('drivers.form.email')} *</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" required /></div>
            <div><label className="form-label">{t('drivers.form.licenseNo')} *</label><input value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} className="form-input" required /></div>
            <div><label className="form-label">{t('drivers.form.licenseExp')} *</label><input type="date" value={form.licenseExpiry} onChange={(e) => setForm({ ...form, licenseExpiry: e.target.value })} className="form-input" required /></div>
            {!editingDriver && <div><label className="form-label">{t('drivers.form.password')}</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="form-input" placeholder={t('drivers.form.passwordPlaceholder')} /></div>}
            <div><label className="form-label">{t('drivers.form.address')}</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="form-input" /></div>

            {/* Document Uploads */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">{t('drivers.docs.title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label text-xs">{t('drivers.docs.profile')}</label>
                  <input type="file" accept="image/*" onChange={(e) => setDocs({ ...docs, profile: e.target.files?.[0] || null })} className="form-input text-sm p-1" />
                </div>
                <div>
                  <label className="form-label text-xs">{t('drivers.docs.license')}</label>
                  <input type="file" accept="image/*" onChange={(e) => setDocs({ ...docs, license: e.target.files?.[0] || null })} className="form-input text-sm p-1" />
                </div>
                <div>
                  <label className="form-label text-xs">{t('drivers.docs.aadhar')}</label>
                  <input type="file" accept="image/*" onChange={(e) => setDocs({ ...docs, aadhar: e.target.files?.[0] || null })} className="form-input text-sm p-1" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn btn-primary">{editingDriver ? t('common.update') : t('common.add')} {t('drivers.table.driver')}</button>
            <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="btn btn-secondary">{t('common.cancel')}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
