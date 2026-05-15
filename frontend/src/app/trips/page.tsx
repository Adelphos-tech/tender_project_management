'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import { Trip, Driver, Vehicle, TripInquiry } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePlay, HiOutlineStop, HiOutlineEye, HiOutlineCurrencyDollar } from 'react-icons/hi';
import { format } from 'date-fns';
import Image from 'next/image';

export default function TripsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { socket } = require('@/context/SocketContext').useSocket();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Create trip modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [approvedInquiries, setApprovedInquiries] = useState<TripInquiry[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [createForm, setCreateForm] = useState({ inquiryId: '', vehicleId: '', driverId: '', notes: '' });

  // Shared Trip State
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Start trip modal
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [startKm, setStartKm] = useState('');
  const [startFile, setStartFile] = useState<File | null>(null);

  // End trip modal
  const [isEndOpen, setIsEndOpen] = useState(false);
  const [endKm, setEndKm] = useState('');
  const [endFile, setEndFile] = useState<File | null>(null);

  // Detail modal
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailTrip, setDetailTrip] = useState<Trip | null>(null);

  // Expense modal
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ type: 'fuel', amount: '', description: '' });
  const [billFile, setBillFile] = useState<File | null>(null);

  const isManager = user?.role === 'admin' || user?.role === 'manager';
  const isDriver = user?.role === 'driver';

  const [activeStatus, setActiveStatus] = useState(true);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [inactiveReason, setInactiveReason] = useState('');

  const fetchDriverStatus = async () => {
    if (!isDriver) return;
    try {
      const res = await api.get('/drivers/me'); 
      const myDriver = res.data;
      if (myDriver) {
        setActiveStatus(myDriver.isActive !== false);
        setInactiveReason(myDriver.inactiveReason || '');
      }
    } catch {}
  };

  const handleStatusUpdate = async (newStatus: boolean) => {
    try {
      await api.patch('/drivers/status', {
        isActive: newStatus,
        inactiveReason: newStatus ? '' : inactiveReason
      });
      setActiveStatus(newStatus);
      setIsStatusModalOpen(false);
      if (newStatus) setInactiveReason('');
      toast.success(`${t('trips.toast.statusUpdated')} ${newStatus ? t('status.available') : t('status.notAvailable')}`);
      fetchTrips();
    } catch {
      toast.error(t('trips.toast.statusUpdateFailed'));
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips', { params: { status: statusFilter || undefined } });
      setTrips(res.data);
    } catch { toast.error(t('trips.toast.loadFailed')); }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    fetchTrips(); 
    if (isDriver) fetchDriverStatus();
  }, [statusFilter]);

  useEffect(() => {
    if (!socket) return;
    const handleNewTrip = () => {
      fetchTrips();
    };
    socket.on('new_trip_assigned', handleNewTrip);
    return () => {
      socket.off('new_trip_assigned', handleNewTrip);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const openCreateModal = async () => {
    try {
      const [inqRes, driverRes, vehicleRes] = await Promise.all([
        api.get('/trip-inquiries', { params: { status: 'approved' } }),
        api.get('/drivers', { params: { status: 'available' } }),
        api.get('/vehicles', { params: { status: 'active' } }),
      ]);
      setApprovedInquiries(inqRes.data);
      setDrivers(driverRes.data);
      setVehicles(vehicleRes.data);
      setIsCreateOpen(true);
    } catch { toast.error(t('trips.toast.loadField')); }
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/trips', createForm);
      toast.success(t('trips.toast.created'));
      setIsCreateOpen(false);
      setCreateForm({ inquiryId: '', vehicleId: '', driverId: '', notes: '' });
      fetchTrips();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t('trips.toast.createFailed'));
    }
  };

  const handleStartTrip = async () => {
    if (!selectedTrip || !startKm || !startFile) {
      toast.error(t('trips.toast.requiredFields'));
      return;
    }
    const formData = new FormData();
    formData.append('startKM', startKm);
    formData.append('startOdometerImage', startFile);
    try {
      await api.patch(`/trips/${selectedTrip._id}/start`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(t('trips.toast.started'));
      setIsStartOpen(false);
      setStartKm('');
      setStartFile(null);
      fetchTrips();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t('trips.toast.actionFailed'));
    }
  };

  const handleEndTrip = async () => {
    if (!selectedTrip || !endKm || !endFile) {
      toast.error(t('trips.toast.requiredFields'));
      return;
    }
    const formData = new FormData();
    formData.append('endKM', endKm);
    formData.append('endOdometerImage', endFile);
    try {
      await api.patch(`/trips/${selectedTrip._id}/end`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(t('trips.toast.ended'));
      setIsEndOpen(false);
      setEndKm('');
      setEndFile(null);
      fetchTrips();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t('trips.toast.actionFailed'));
    }
  };

  const viewTripDetail = async (tripId: string) => {
    try {
      const res = await api.get(`/trips/${tripId}`);
      setDetailTrip(res.data);
      setIsDetailOpen(true);
    } catch { toast.error(t('trips.toast.detailsFailed')); }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip) return;
    const formData = new FormData();
    formData.append('tripId', selectedTrip._id);
    formData.append('type', expenseForm.type);
    formData.append('amount', expenseForm.amount);
    formData.append('description', expenseForm.description);
    if (billFile) formData.append('billImage', billFile);
    try {
      await api.post('/expenses', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(t('trips.toast.expenseAdded'));
      setIsExpenseOpen(false);
      setExpenseForm({ type: 'fuel', amount: '', description: '' });
      setBillFile(null);
      fetchTrips();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || t('trips.toast.expenseFailed'));
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title">{t('trips.title')}</h1>
        <div className="flex gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select w-auto">
            <option value="">{t('trips.allStatus')}</option>
            <option value="in-progress">{t('status.in-progress')}</option>
            <option value="completed">{t('status.completed')}</option>
          </select>
          {isDriver && (
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 pr-3">
              <button 
                onClick={() => {
                  if (activeStatus) setIsStatusModalOpen(true);
                  else handleStatusUpdate(true);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${activeStatus ? 'bg-green-500 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}
              >
                {activeStatus ? t('status.available') : t('status.notAvailable')}
              </button>
              <span className="text-xs text-slate-500 font-medium">{t('trips.statusLabel')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12"><div className="spinner" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('trips.table.vehicle')}</th>
                  <th>{t('trips.table.driver')}</th>
                  <th>{t('trips.table.route')}</th>
                  <th>{t('trips.table.status')}</th>
                  <th>{t('trips.table.distance')}</th>
                  <th>{t('trips.table.expense')}</th>
                  <th>{t('trips.table.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {trips.length > 0 ? trips.map((trip) => (
                  <tr key={trip._id}>
                    <td className="font-semibold">{trip.vehicle?.vehicleNumber || 'N/A'}</td>
                    <td>{trip.driver?.name || 'N/A'}</td>
                    <td className="text-sm">{trip.inquiry?.pickupLocation || 'N/A'} → {trip.inquiry?.dropLocation || 'N/A'}</td>
                    <td><StatusBadge status={trip.status} /></td>
                    <td>{trip.totalDistance ? `${trip.totalDistance} km` : '-'}</td>
                    <td>{trip.totalExpense ? `₹${trip.totalExpense.toLocaleString()}` : '-'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => viewTripDetail(trip._id)} className="btn btn-secondary btn-sm"><HiOutlineEye size={14} /></button>
                        {isDriver && trip.status === 'assigned' && (
                          <button onClick={() => { setSelectedTrip(trip); setIsStartOpen(true); }} className="btn btn-success btn-sm"><HiOutlinePlus size={14} /> {t('trips.startBtn')}</button>
                        )}
                        {isDriver && trip.status === 'in-progress' && (
                          <>
                            <button onClick={() => { setSelectedTrip(trip); setIsExpenseOpen(true); }} className="btn btn-primary btn-sm"><HiOutlineCurrencyDollar size={14} /></button>
                            <button onClick={() => { setSelectedTrip(trip); setIsEndOpen(true); }} className="btn btn-danger btn-sm"><HiOutlineStop size={14} /> {t('trips.endBtn')}</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-400">{t('trips.noTrips')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Start Trip Modal */}
      <Modal isOpen={isStartOpen} onClose={() => { setIsStartOpen(false); setStartKm(''); setStartFile(null); }} title={t('trips.startModal.title')}>
        <div className="space-y-4">
          <div>
            <label className="form-label">{t('trips.startModal.kmLabel')} *</label>
            <input type="number" value={startKm} onChange={(e) => setStartKm(e.target.value)} className="form-input" placeholder={t('trips.startModal.kmPlaceholder')} required />
          </div>
          <div>
            <label className="form-label flex justify-between">
              <span>{t('trips.startModal.imgLabel')} *</span>
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded cursor-pointer" onClick={() => {
                const input = document.getElementById('startCameraInput');
                if (input) input.click();
              }}>
                📷 {t('trips.startModal.takePhoto')}
              </span>
            </label>
            <input id="startCameraInput" type="file" accept="image/*" capture="environment" onChange={(e) => setStartFile(e.target.files?.[0] || null)} className="hidden" />
            {startFile ? (
              <div className="mt-2 p-3 border rounded-lg bg-green-50 text-green-700 flex justify-between items-center">
                <span className="truncate max-w-[200px]">{startFile.name}</span>
                <button onClick={() => setStartFile(null)} className="text-red-500 hover:text-red-700 text-sm font-bold">✕</button>
              </div>
            ) : (
              <div className="mt-2 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition" onClick={() => { const input = document.getElementById('startCameraInput'); if (input) input.click(); }}>
                <p className="text-slate-500">{t('trips.startModal.uploadHint')}</p>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleStartTrip} className="btn btn-success">{t('trips.startBtn')} {t('nav.trips').slice(0, -1)}</button>
            <button onClick={() => { setIsStartOpen(false); setStartKm(''); setStartFile(null); }} className="btn btn-secondary">{t('common.cancel')}</button>
          </div>
        </div>
      </Modal>

      {/* End Trip Modal */}
      <Modal isOpen={isEndOpen} onClose={() => { setIsEndOpen(false); setEndKm(''); setEndFile(null); }} title={t('trips.endModal.title')}>
        <div className="space-y-4">
          {selectedTrip && selectedTrip.startKM && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm">
              <span className="font-bold">Info:</span> {t('trips.endModal.info')} <b>{selectedTrip.startKM} km</b>
            </div>
          )}
          <div>
            <label className="form-label">{t('trips.endModal.kmLabel')} *</label>
            <input type="number" value={endKm} onChange={(e) => setEndKm(e.target.value)} className="form-input" placeholder={t('trips.endModal.kmPlaceholder')} required />
          </div>
          <div>
            <label className="form-label flex justify-between">
              <span>{t('trips.endModal.imgLabel')} *</span>
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded cursor-pointer" onClick={() => {
                const input = document.getElementById('endCameraInput');
                if (input) input.click();
              }}>
                📷 {t('trips.startModal.takePhoto')}
              </span>
            </label>
            <input id="endCameraInput" type="file" accept="image/*" capture="environment" onChange={(e) => setEndFile(e.target.files?.[0] || null)} className="hidden" />
            {endFile ? (
              <div className="mt-2 p-3 border rounded-lg bg-green-50 text-green-700 flex justify-between items-center">
                <span className="truncate max-w-[200px]">{endFile.name}</span>
                <button onClick={() => setEndFile(null)} className="text-red-500 hover:text-red-700 text-sm font-bold">✕</button>
              </div>
            ) : (
              <div className="mt-2 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition" onClick={() => { const input = document.getElementById('endCameraInput'); if (input) input.click(); }}>
                <p className="text-slate-500">{t('trips.startModal.uploadHint')}</p>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleEndTrip} className="btn btn-danger">{t('trips.endBtn')} {t('nav.trips').slice(0, -1)}</button>
            <button onClick={() => { setIsEndOpen(false); setEndKm(''); setEndFile(null); }} className="btn btn-secondary">{t('common.cancel')}</button>
          </div>
        </div>
      </Modal>

      {/* Add Expense Modal */}
      <Modal isOpen={isExpenseOpen} onClose={() => { setIsExpenseOpen(false); setBillFile(null); }} title={t('trips.expenseModal.title')}>
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label className="form-label">{t('trips.expenseModal.type')} *</label>
            <select value={expenseForm.type} onChange={(e) => setExpenseForm({ ...expenseForm, type: e.target.value })} className="form-select">
              <option value="fuel">{t('expenses.types.fuel')}</option>
              <option value="toll">{t('expenses.types.toll')}</option>
              <option value="parking">{t('expenses.types.parking')}</option>
              <option value="food">{t('expenses.types.food')}</option>
              <option value="maintenance">{t('expenses.types.maintenance')}</option>
              <option value="other">{t('expenses.types.other')}</option>
            </select>
          </div>
          <div><label className="form-label">{t('trips.expenseModal.amount')} *</label><input type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} className="form-input" required /></div>
          <div><label className="form-label">{t('trips.expenseModal.description')}</label><input value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} className="form-input" /></div>
          <div>
            <label className="form-label flex justify-between">
              <span>{t('trips.expenseModal.billImg')}</span>
              <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded cursor-pointer" onClick={() => {
                const input = document.getElementById('expenseCameraInput');
                if (input) input.click();
              }}>
                📷 {t('trips.startModal.takePhoto')}
              </span>
            </label>
            <input 
              id="expenseCameraInput"
              type="file" 
              accept="image/*" 
              capture="environment"
              onChange={(e) => setBillFile(e.target.files?.[0] || null)} 
              className="hidden" 
            />
            {billFile ? (
              <div className="mt-2 p-3 border rounded-lg bg-green-50 text-green-700 flex justify-between items-center">
                <span className="truncate max-w-[200px]">{billFile.name}</span>
                <button type="button" onClick={() => setBillFile(null)} className="text-red-500 hover:text-red-700 text-sm font-bold">✕</button>
              </div>
            ) : (
              <div 
                className="mt-2 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 transition"
                onClick={() => {
                  const input = document.getElementById('expenseCameraInput');
                  if (input) input.click();
                }}
              >
                <p className="text-slate-500 text-sm">{t('trips.expenseModal.uploadHint')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('trips.expenseModal.cameraHint')}</p>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn btn-primary">{t('trips.expenseModal.addBtn')}</button>
            <button type="button" onClick={() => setIsExpenseOpen(false)} className="btn btn-secondary">{t('common.cancel')}</button>
          </div>
        </form>
      </Modal>

      {/* Driver Status Modal */}
      <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title={t('trips.statusModal.title')}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">{t('trips.statusModal.info')}</p>
          <div>
            <label className="form-label">{t('trips.statusModal.reasonLabel')} *</label>
            <textarea 
              value={inactiveReason} 
              onChange={(e) => setInactiveReason(e.target.value)} 
              className="form-input min-h-[100px]" 
              placeholder={t('trips.statusModal.reasonPlaceholder')}
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => handleStatusUpdate(false)} 
              className="btn btn-danger"
              disabled={!inactiveReason.trim()}
            >
              {t('trips.statusModal.confirmBtn')}
            </button>
            <button onClick={() => setIsStatusModalOpen(false)} className="btn btn-secondary">{t('common.cancel')}</button>
          </div>
        </div>
      </Modal>

      {/* Trip Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title={t('trips.details.title')} size="xl">
        {detailTrip && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500">{t('trips.statusLabel')}</p>
                <StatusBadge status={detailTrip.status} />
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500">{t('trips.details.distance')}</p>
                <p className="text-lg font-bold text-slate-800">{detailTrip.totalDistance ? `${detailTrip.totalDistance} km` : '-'}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500">{t('trips.details.totalExpense')}</p>
                <p className="text-lg font-bold text-slate-800">{detailTrip.totalExpense ? `₹${detailTrip.totalExpense}` : '-'}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500">{t('trips.details.costPerKm')}</p>
                <p className="text-lg font-bold text-slate-800">{detailTrip.costPerKM ? `₹${detailTrip.costPerKM}` : '-'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div><p className="form-label text-slate-500">{t('trips.table.vehicle')}</p><p className="font-semibold">{detailTrip.vehicle?.vehicleNumber} - {detailTrip.vehicle?.model}</p></div>
              <div><p className="form-label text-slate-500">{t('trips.table.driver')}</p><p className="font-semibold">{detailTrip.driver?.name} ({detailTrip.driver?.phone})</p></div>
              <div className="sm:col-span-2 border-t pt-4"></div>
              <div><p className="form-label text-slate-500">{t('trips.details.pickup')}</p><p className="font-semibold">{detailTrip.inquiry?.pickupLocation}</p></div>
              <div><p className="form-label text-slate-500">{t('trips.details.drop')}</p><p className="font-semibold">{detailTrip.inquiry?.dropLocation}</p></div>
              <div className="sm:col-span-2 border-t pt-4"></div>
              <div><p className="form-label text-slate-500">{t('trips.details.startKm')}</p><p className="font-semibold">{detailTrip.startKM ?? '-'}</p></div>
              <div><p className="form-label text-slate-500">{t('trips.details.endKm')}</p><p className="font-semibold">{detailTrip.endKM ?? '-'}</p></div>
            </div>
            
            {/* Odometer Images */}
            {(detailTrip.startOdometerImage || detailTrip.endOdometerImage) && (
              <div>
                <h4 className="font-bold text-slate-800 mb-3">{t('trips.details.odometerProof')}</h4>
                <div className="flex gap-4 overflow-x-auto">
                  {detailTrip.startOdometerImage && (
                    <div className="flex-shrink-0">
                      <p className="text-xs text-slate-500 mb-1">{t('trips.details.startOdo')}</p>
                      <a href={detailTrip.startOdometerImage} target="_blank" rel="noopener noreferrer">
                        <img src={detailTrip.startOdometerImage} alt="Start Odometer" className="h-32 w-32 object-cover rounded-lg border shadow-sm hover:opacity-90 transition" />
                      </a>
                    </div>
                  )}
                  {detailTrip.endOdometerImage && (
                    <div className="flex-shrink-0">
                      <p className="text-xs text-slate-500 mb-1">{t('trips.details.endOdo')}</p>
                      <a href={detailTrip.endOdometerImage} target="_blank" rel="noopener noreferrer">
                        <img src={detailTrip.endOdometerImage} alt="End Odometer" className="h-32 w-32 object-cover rounded-lg border shadow-sm hover:opacity-90 transition" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {detailTrip.expenses && detailTrip.expenses.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-800 mb-3">{t('trips.details.expenses')}</h4>
                <div className="overflow-x-auto">
                  <table className="data-table w-full">
                    <thead><tr><th>{t('trips.details.expTable.type')}</th><th>{t('trips.details.expTable.amount')}</th><th>{t('trips.details.expTable.description')}</th><th>{t('trips.details.expTable.date')}</th><th>{t('trips.details.expTable.bill')}</th></tr></thead>
                    <tbody>
                      {detailTrip.expenses.map((exp: any) => (
                        <tr key={exp._id}>
                          <td className="capitalize">{exp.type}</td>
                          <td>₹{exp.amount}</td>
                          <td>{exp.description || '-'}</td>
                          <td>{format(new Date(exp.date), 'dd MMM yyyy')}</td>
                          <td>
                            {exp.billImage ? (
                              <a href={exp.billImage} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1">
                                <HiOutlineEye /> {t('common.view')}
                              </a>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
