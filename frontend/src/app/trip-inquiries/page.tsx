'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/api';
import { TripInquiry } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import { format } from 'date-fns';

export default function TripInquiriesPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [inquiries, setInquiries] = useState<TripInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<TripInquiry | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [form, setForm] = useState({ pickupLocation: '', dropLocation: '', dateTime: '', notes: '', vehicle: '' });
  const [vehicles, setVehicles] = useState<any[]>([]);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/trip-inquiries', { params: { status: statusFilter || undefined } });
      setInquiries(res.data);
    } catch { toast.error(t('inquiries.toast.loadFailed')); }
    finally { setLoading(false); }
  };

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/vehicles/available');
      setVehicles(res.data);
    } catch { toast.error(t('inquiries.toast.loadVehiclesFailed')); }
  };

  useEffect(() => { 
    fetchInquiries(); 
    if (user?.role === 'staff' || user?.role === 'manager' || user?.role === 'admin') {
      fetchVehicles();
    }
  }, [statusFilter, user]);

  const { socket } = require('@/context/SocketContext').useSocket();
  useEffect(() => {
    if (!socket) return;
    const reloadData = () => fetchInquiries();
    
    socket.on('new_inquiry', reloadData);
    socket.on('inquiry_approved', reloadData);
    socket.on('inquiry_rejected', reloadData);
    
    return () => {
      socket.off('new_inquiry', reloadData);
      socket.off('inquiry_approved', reloadData);
      socket.off('inquiry_rejected', reloadData);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, statusFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/trip-inquiries', form);
      toast.success(t('inquiries.toast.submitted'));
      setIsCreateOpen(false);
      setForm({ pickupLocation: '', dropLocation: '', dateTime: '', notes: '', vehicle: '' });
      fetchInquiries();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t('inquiries.toast.submitFailed'));
    }
  };

  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [drivers, setDrivers] = useState<any[]>([]);

  const fetchDrivers = async () => {
    try {
      const res = await api.get('/drivers/available');
      setDrivers(res.data);
    } catch { toast.error(t('inquiries.toast.loadDriversFailed')); }
  };

  const handleApproveClick = (inq: TripInquiry) => {
    setSelectedInquiry(inq);
    fetchDrivers();
    setIsApproveOpen(true);
  };

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !selectedDriver) return;
    try {
      await api.patch(`/trip-inquiries/${selectedInquiry._id}/status`, { status: 'approved', driverId: selectedDriver });
      toast.success(t('inquiries.toast.approved'));
      setIsApproveOpen(false);
      setSelectedDriver('');
      fetchInquiries();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t('inquiries.toast.approveFailed'));
    }
  };

  const handleReject = async () => {
    if (!selectedInquiry || !rejectionReason) return;
    try {
      await api.patch(`/trip-inquiries/${selectedInquiry._id}/status`, { status: 'rejected', rejectionReason });
      toast.success(t('inquiries.toast.rejected'));
      setIsRejectOpen(false);
      setRejectionReason('');
      fetchInquiries();
    } catch { toast.error(t('inquiries.toast.rejectFailed')); }
  };

  const isStaff = user?.role === 'staff';
  const canReview = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">{t('inquiries.title')}</h1>
        <div className="flex gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select w-auto">
            <option value="">{t('inquiries.allStatus')}</option>
            <option value="pending">{t('status.pending')}</option>
            <option value="approved">{t('status.approved')}</option>
            <option value="rejected">{t('status.rejected')}</option>
          </select>
          {(isStaff || canReview) && (
            <button onClick={() => setIsCreateOpen(true)} className="btn btn-primary">
              <HiOutlinePlus size={18} /> {t('inquiries.newInquiry')}
            </button>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12"><div className="spinner" /></div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    {!isStaff && <th>{t('inquiries.table.createdBy')}</th>}
                    <th>{t('inquiries.table.pickup')}</th>
                    <th>{t('inquiries.table.drop')}</th>
                    <th>{t('inquiries.table.dateTime')}</th>
                    <th>{t('inquiries.table.notes')}</th>
                    <th>{t('inquiries.table.status')}</th>
                    {canReview && <th>{t('inquiries.table.actions')}</th>}
                  </tr>
                </thead>
                <tbody>
                  {inquiries.length > 0 ? inquiries.map((inq) => (
                    <tr key={inq._id}>
                      {!isStaff && <td className="font-medium">{inq.createdBy?.name || 'N/A'}</td>}
                      <td>{inq.pickupLocation}</td>
                      <td>{inq.dropLocation}</td>
                      <td>{format(new Date(inq.dateTime), 'dd MMM yyyy, hh:mm a')}</td>
                      <td className="max-w-48 truncate">{inq.notes || '-'}</td>
                      <td><StatusBadge status={inq.status} /></td>
                      {canReview && (
                        <td>
                          {inq.status === 'pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleApproveClick(inq)} className="btn btn-success btn-sm"><HiOutlineCheck size={14} /> {t('inquiries.approveBtn')}</button>
                              <button onClick={() => { setSelectedInquiry(inq); setIsRejectOpen(true); }} className="btn btn-danger btn-sm"><HiOutlineX size={14} /> {t('inquiries.rejectBtn')}</button>
                            </div>
                          )}
                          {inq.status === 'rejected' && inq.rejectionReason && (
                            <span className="text-xs text-red-500">{t('inquiries.mobile.reason')}: {inq.rejectionReason}</span>
                          )}
                        </td>
                      )}
                    </tr>
                  )) : (
                    <tr><td colSpan={7} className="text-center py-8 text-slate-400">{t('inquiries.noInquiries')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 gap-4 p-4 bg-slate-50/50">
              {inquiries.length > 0 ? inquiries.map((inq) => (
                <div key={inq._id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      {!isStaff && <p className="text-sm font-semibold text-slate-800">{inq.createdBy?.name || 'N/A'}</p>}
                      <span className="text-xs text-slate-500">{format(new Date(inq.dateTime), 'dd MMM yyyy, hh:mm a')}</span>
                    </div>
                    <StatusBadge status={inq.status} />
                  </div>
                  <div className="text-sm flex flex-col gap-1.5 mt-1">
                    <div className="flex gap-2"><span className="text-slate-500 min-w-[3rem]">{t('inquiries.mobile.from')}:</span><span className="font-medium text-slate-700">{inq.pickupLocation}</span></div>
                    <div className="flex gap-2"><span className="text-slate-500 min-w-[3rem]">{t('inquiries.mobile.to')}:</span><span className="font-medium text-slate-700">{inq.dropLocation}</span></div>
                    {inq.notes && <div className="flex gap-2 mt-1"><span className="text-slate-500 min-w-[3rem]">{t('inquiries.mobile.notes')}:</span><span className="text-slate-600 text-xs italic bg-slate-50 p-2 rounded-md w-full">{inq.notes}</span></div>}
                  </div>
                  
                  {canReview && (
                    <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                      {inq.status === 'pending' && (
                        <>
                          <button onClick={() => handleApproveClick(inq)} className="btn btn-success btn-sm flex-1 justify-center"><HiOutlineCheck size={14} /> {t('inquiries.approveBtn')}</button>
                          <button onClick={() => { setSelectedInquiry(inq); setIsRejectOpen(true); }} className="btn btn-danger btn-sm flex-1 justify-center"><HiOutlineX size={14} /> {t('inquiries.rejectBtn')}</button>
                        </>
                      )}
                      {inq.status === 'rejected' && inq.rejectionReason && (
                        <div className="text-xs text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 w-full text-center">
                          <span className="font-semibold">{t('inquiries.mobile.reason')}:</span> {inq.rejectionReason}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )) : (
                <div className="text-center py-8 text-slate-400 text-sm">{t('inquiries.noInquiries')}</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Inquiry Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title={t('inquiries.createModal.title')}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="form-label">{t('inquiries.createModal.vehicleLabel')} *</label>
            <select 
              value={form.vehicle} 
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })} 
              className="form-select" 
              required
            >
              <option value="">{t('inquiries.createModal.vehiclePlaceholder')}</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.model} ({t(`vehicles.types.${v.type?.toLowerCase()}`) || v.type}) - {v.vehicleNumber}</option>
              ))}
            </select>
          </div>
          <div><label className="form-label">{t('inquiries.createModal.pickup')} *</label><input value={form.pickupLocation} onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })} className="form-input" required /></div>
          <div><label className="form-label">{t('inquiries.createModal.drop')} *</label><input value={form.dropLocation} onChange={(e) => setForm({ ...form, dropLocation: e.target.value })} className="form-input" required /></div>
          <div><label className="form-label">{t('inquiries.createModal.dateTime')} *</label><input type="datetime-local" value={form.dateTime} onChange={(e) => setForm({ ...form, dateTime: e.target.value })} className="form-input" required /></div>
          <div><label className="form-label">{t('inquiries.mobile.notes')}</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="form-input" rows={3} /></div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn btn-primary">{t('inquiries.createModal.submitBtn')}</button>
            <button type="button" onClick={() => setIsCreateOpen(false)} className="btn btn-secondary">{t('common.cancel')}</button>
          </div>
        </form>
      </Modal>

      {/* Approve Modal */}
      <Modal isOpen={isApproveOpen} onClose={() => { setIsApproveOpen(false); setSelectedDriver(''); }} title={t('inquiries.approveModal.title')}>
        <form onSubmit={handleApproveSubmit} className="space-y-4">
          <p className="text-sm text-slate-600">{t('inquiries.approveModal.info')}</p>
          <div>
            <label className="form-label">{t('inquiries.approveModal.driverLabel')} *</label>
            <select 
              value={selectedDriver} 
              onChange={(e) => setSelectedDriver(e.target.value)} 
              className="form-select" 
              required
            >
              <option value="">{t('inquiries.approveModal.driverPlaceholder')}</option>
              {drivers.map(d => (
                <option key={d._id} value={d._id}>{d.name} ({d.phone})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn btn-success" disabled={!selectedDriver}>{t('inquiries.approveModal.approveBtn')}</button>
            <button type="button" onClick={() => { setIsApproveOpen(false); setSelectedDriver(''); }} className="btn btn-secondary">{t('common.cancel')}</button>
          </div>
        </form>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={isRejectOpen} onClose={() => { setIsRejectOpen(false); setRejectionReason(''); }} title={t('inquiries.rejectModal.title')} size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">{t('inquiries.rejectModal.info')}</p>
          <div><label className="form-label">{t('inquiries.rejectModal.reasonLabel')} *</label><textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="form-input" rows={3} required /></div>
          <div className="flex gap-3">
            <button onClick={handleReject} disabled={!rejectionReason} className="btn btn-danger">{t('inquiries.rejectBtn')}</button>
            <button onClick={() => { setIsRejectOpen(false); setRejectionReason(''); }} className="btn btn-secondary">{t('common.cancel')}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
