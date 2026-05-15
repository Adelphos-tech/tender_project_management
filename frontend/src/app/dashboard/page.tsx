'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import { DashboardStats, Trip } from '@/types';
import { motion, type Variants } from 'framer-motion';
import {
  HiOutlineTruck,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineMap,
  HiOutlineCurrencyDollar,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineArrowRight,
  HiOutlineCalendar,
} from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';

const CHART_COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setData(res.data);
      } catch {
        console.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return <p className="text-slate-500">{t('common.noData')}</p>;

  const tripChartData = data.tripsByMonth.map((item) => ({
    name: (t('common.months') as unknown as string[])[item._id.month - 1],
    trips: item.count,
    distance: item.distance,
  }));

  const expenseChartData = data.expenseByType.map((item) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.total,
  }));

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen pb-8"
    >
      {/* Premium Header Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
              <HiOutlineCalendar size={16} />
              <span>{currentDate}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Welcome back, <span className="font-semibold text-slate-700">{user?.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-slate-600">System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - Premium Design */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatsCard
          title="Total Vehicles"
          value={data.stats.totalVehicles}
          icon={<HiOutlineTruck size={24} />}
          color="blue"
          subtitle={`${data.stats.activeVehicles} active`}
          trend="up"
          trendValue="12%"
        />
        <StatsCard
          title="Total Drivers"
          value={data.stats.totalDrivers}
          icon={<HiOutlineUsers size={24} />}
          color="indigo"
          subtitle={`${data.stats.availableDrivers} available`}
          trend="up"
          trendValue="8%"
        />
        <StatsCard
          title="Active Trips"
          value={data.stats.activeTrips}
          icon={<HiOutlineMap size={24} />}
          color="emerald"
          subtitle={`${data.stats.completedTrips} completed`}
        />
        <StatsCard
          title="Pending Inquiries"
          value={data.stats.pendingInquiries}
          icon={<HiOutlineClipboardList size={24} />}
          color="yellow"
          subtitle="Awaiting approval"
        />
        <StatsCard
          title="Total Expenses"
          value={`₹${data.stats.totalExpense.toLocaleString()}`}
          icon={<HiOutlineCurrencyDollar size={24} />}
          color="red"
          trend="down"
          trendValue="5%"
        />
        <StatsCard
          title="Completed Trips"
          value={data.stats.completedTrips}
          icon={<HiOutlineCheckCircle size={24} />}
          color="green"
          trend="up"
          trendValue="23%"
        />
        <StatsCard
          title="Active Vehicles"
          value={data.stats.activeVehicles}
          icon={<HiOutlineTruck size={24} />}
          color="purple"
          subtitle="Ready for trips"
        />
        <StatsCard
          title="Available Drivers"
          value={data.stats.availableDrivers}
          icon={<HiOutlineClock size={24} />}
          color="orange"
          subtitle="On standby"
        />
      </motion.div>

      {/* Charts Section - Premium Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* Trips Overview - Takes 2 columns */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Trips Overview</h3>
              <p className="text-sm text-slate-500">Monthly trips and distance comparison</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-xs font-medium text-slate-600">Trips</span>
              <div className="w-3 h-3 rounded-full bg-blue-400 ml-2" />
              <span className="text-xs font-medium text-slate-600">Distance</span>
            </div>
          </div>

          {tripChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={tripChartData}>
                <defs>
                  <linearGradient id="tripsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="distanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="trips"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fill="url(#tripsGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="distance"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#distanceGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-400">
              No data available
            </div>
          )}
        </div>

        {/* Expense Breakdown - Takes 1 column */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Expense Breakdown</h3>
            <p className="text-sm text-slate-500">Distribution by category</p>
          </div>

          {expenseChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={expenseChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {expenseChartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-400">
              No data available
            </div>
          )}

          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {expenseChartData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                />
                <span className="text-xs text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Recent Trips</h3>
              <p className="text-sm text-slate-500">Latest trip activities</p>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
              View All
              <HiOutlineArrowRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                    Vehicle
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                    Driver
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                    Route
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                    Distance
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">
                    Expense
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentTrips.length > 0 ? (
                  data.recentTrips.map((trip: Trip) => (
                    <tr
                      key={trip._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <HiOutlineTruck size={16} className="text-blue-600" />
                          </div>
                          <span className="font-medium text-slate-900">
                            {trip.vehicle?.vehicleNumber || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                            {trip.driver?.name?.charAt(0) || '?'}
                          </div>
                          <span className="text-slate-700">{trip.driver?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">
                          <span className="font-medium text-slate-800">
                            {trip.inquiry?.pickupLocation || 'N/A'}
                          </span>
                          <span className="text-slate-400 mx-2">→</span>
                          <span>{trip.inquiry?.dropLocation || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={trip.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {trip.totalDistance ? `${trip.totalDistance} km` : '-'}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900">
                        {trip.totalExpense ? `₹${trip.totalExpense.toLocaleString()}` : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-slate-400 py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                          <HiOutlineMap size={24} className="text-slate-400" />
                        </div>
                        <p>No recent trips</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
