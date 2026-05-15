'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Driver, Vehicle } from '@/types';
import { HiOutlineChartBar, HiOutlineFilter } from 'react-icons/hi';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportSummary {
  totalTrips: number;
  totalDistance: number;
  totalExpense: number;
  avgCostPerKM: number;
}

interface DetailedReport {
  trips: Array<{
    _id: string;
    vehicle: { vehicleNumber: string; model: string };
    driver: { name: string };
    inquiry: { pickupLocation: string; dropLocation: string };
    totalDistance: number;
    totalExpense: number;
    costPerKM: number;
    completedAt: string;
  }>;
  expenseBreakdown: Array<{ _id: string; total: number; count: number }>;
  monthlySummary: Array<{ _id: { year: number; month: number }; trips: number; distance: number; expense: number }>;
}



export default function ReportsPage() {
  const { t } = useLanguage();
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [detailed, setDetailed] = useState<DetailedReport | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', vehicleId: '', driverId: '' });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const [summaryRes, detailedRes] = await Promise.all([
        api.get('/reports/summary', { params }),
        api.get('/reports/detailed', { params }),
      ]);
      setSummary(summaryRes.data);
      setDetailed(detailedRes.data);
    } catch { toast.error(t('reports.toast.loadFailed')); }
    finally { setLoading(false); }
  };

  const fetchFilterOptions = async () => {
    try {
      const [driverRes, vehicleRes] = await Promise.all([
        api.get('/drivers'),
        api.get('/vehicles'),
      ]);
      setDrivers(driverRes.data);
      setVehicles(vehicleRes.data);
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchReports(); fetchFilterOptions(); }, []);

  const handleFilterApply = () => fetchReports();

  const monthlyChartData = detailed?.monthlySummary.map((m) => ({
    name: `${(t('common.months') as unknown as string[])[m._id.month - 1]} ${m._id.year}`,
    trips: m.trips,
    distance: m.distance,
    expense: m.expense,
  })).reverse() || [];

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-2"><HiOutlineChartBar size={28} className="text-blue-500" /> {t('reports.title')}</h1>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-6">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><HiOutlineFilter size={18} /> {t('reports.filters')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div><label className="form-label">{t('reports.startDate')}</label><input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} className="form-input" /></div>
          <div><label className="form-label">{t('reports.endDate')}</label><input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} className="form-input" /></div>
          <div>
            <label className="form-label">{t('reports.vehicle')}</label>
            <select value={filters.vehicleId} onChange={(e) => setFilters({ ...filters, vehicleId: e.target.value })} className="form-select">
              <option value="">{t('reports.allVehicles')}</option>
              {vehicles.map((v) => <option key={v._id} value={v._id}>{v.vehicleNumber}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">{t('reports.driver')}</label>
            <select value={filters.driverId} onChange={(e) => setFilters({ ...filters, driverId: e.target.value })} className="form-select">
              <option value="">{t('reports.allDrivers')}</option>
              {drivers.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleFilterApply} className="btn btn-primary w-full">{t('reports.applyBtn')}</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="spinner" /></div>
      ) : (
        <>
          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="card p-6">
                <p className="text-sm text-slate-500">{t('reports.summary.totalTrips')}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{summary.totalTrips}</p>
              </div>
              <div className="card p-6">
                <p className="text-sm text-slate-500">{t('reports.summary.totalDistance')}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{summary.totalDistance.toLocaleString()} km</p>
              </div>
              <div className="card p-6">
                <p className="text-sm text-slate-500">{t('reports.summary.totalExpense')}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">₹{summary.totalExpense.toLocaleString()}</p>
              </div>
              <div className="card p-6">
                <p className="text-sm text-slate-500">{t('reports.summary.avgCost')}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">₹{summary.avgCostPerKM.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Monthly Chart */}
          {monthlyChartData.length > 0 && (
            <div className="card p-6 mb-8">
              <h3 className="font-bold text-slate-800 mb-4">{t('reports.charts.monthlyOverview')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="trips" fill="#3b82f6" name={t('reports.charts.trips')} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="distance" fill="#6366f1" name={t('reports.charts.distance')} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Expense Breakdown */}
          {detailed?.expenseBreakdown && detailed.expenseBreakdown.length > 0 && (
            <div className="card p-6 mb-8">
              <h3 className="font-bold text-slate-800 mb-4">{t('reports.expenseBreakdown')}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {detailed.expenseBreakdown.map((item) => (
                  <div key={item._id} className="bg-slate-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-500 capitalize mb-1">{item._id}</p>
                    <p className="text-lg font-bold text-slate-800">₹{item.total.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{item.count} entries</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Trips Table */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">{t('reports.completedTrips')}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>{t('reports.table.vehicle')}</th><th>{t('reports.table.driver')}</th><th>{t('reports.table.route')}</th><th>{t('reports.table.distance')}</th><th>{t('reports.table.expense')}</th><th>{t('reports.table.costPerKm')}</th><th>{t('reports.table.completed')}</th></tr></thead>
                <tbody>
                  {detailed?.trips && detailed.trips.length > 0 ? detailed.trips.map((trip) => (
                    <tr key={trip._id}>
                      <td className="font-semibold">{trip.vehicle?.vehicleNumber}</td>
                      <td>{trip.driver?.name}</td>
                      <td className="text-sm">{trip.inquiry?.pickupLocation} → {trip.inquiry?.dropLocation}</td>
                      <td>{trip.totalDistance} km</td>
                      <td>₹{trip.totalExpense.toLocaleString()}</td>
                      <td>₹{trip.costPerKM.toFixed(2)}</td>
                      <td>{trip.completedAt ? format(new Date(trip.completedAt), 'dd MMM yyyy') : '-'}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={7} className="text-center py-8 text-slate-400">{t('reports.noData')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
