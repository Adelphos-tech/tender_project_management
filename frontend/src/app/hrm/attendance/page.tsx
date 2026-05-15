'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlineClock,
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineUserGroup,
  HiOutlineTrendingUp,
  HiOutlineLocationMarker,
  HiOutlineDeviceMobile,
  HiOutlineFilter,
  HiOutlineDownload,
  HiOutlinePlay,
  HiOutlineStop,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';

const attendanceStats = [
  { label: 'Present Today', value: '142', total: '156', percentage: 91, icon: HiOutlineCheckCircle, color: 'green' },
  { label: 'On Leave', value: '8', total: '156', percentage: 5, icon: HiOutlineCalendar, color: 'amber' },
  { label: 'Absent', value: '6', total: '156', percentage: 4, icon: HiOutlineXCircle, color: 'red' },
  { label: 'Late Today', value: '12', change: '-2', icon: HiOutlineClock, color: 'orange' },
];

const weeklyData = [
  { day: 'Mon', present: 148, absent: 4, late: 8 },
  { day: 'Tue', present: 150, absent: 3, late: 6 },
  { day: 'Wed', present: 145, absent: 6, late: 11 },
  { day: 'Thu', present: 152, absent: 2, late: 4 },
  { day: 'Fri', present: 142, absent: 8, late: 12 },
  { day: 'Sat', present: 120, absent: 15, late: 2 },
];

const todayAttendance = [
  { id: 'EMP001', name: 'Rajesh Sharma', department: 'Operations', checkIn: '09:02 AM', checkOut: '-', status: 'present', location: 'Mumbai HQ', method: 'Biometric' },
  { id: 'EMP002', name: 'Priya Patel', department: 'HR', checkIn: '08:55 AM', checkOut: '-', status: 'present', location: 'Mumbai HQ', method: 'Mobile App' },
  { id: 'EMP003', name: 'Amit Kumar', department: 'Finance', checkIn: '09:30 AM', checkOut: '-', status: 'late', location: 'Delhi Branch', method: 'Biometric' },
  { id: 'EMP004', name: 'Sneha Gupta', department: 'Operations', checkIn: '-', checkOut: '-', status: 'on_leave', location: '-', method: '-' },
  { id: 'EMP005', name: 'Vikram Singh', department: 'Maintenance', checkIn: '09:15 AM', checkOut: '-', status: 'present', location: 'Mumbai HQ', method: 'Biometric' },
  { id: 'EMP006', name: 'Anita Desai', department: 'Sales', checkIn: '-', checkOut: '-', status: 'absent', location: '-', method: '-' },
];

const shiftSchedule = [
  { name: 'Morning Shift', time: '06:00 AM - 02:00 PM', employees: 45, active: true },
  { name: 'General Shift', time: '09:00 AM - 06:00 PM', employees: 78, active: true },
  { name: 'Evening Shift', time: '02:00 PM - 10:00 PM', employees: 25, active: false },
  { name: 'Night Shift', time: '10:00 PM - 06:00 AM', employees: 8, active: false },
];

export default function AttendancePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [selectedView, setSelectedView] = useState('daily');

  const getStatusBadge = (status: string) => {
    const styles = {
      present: 'bg-green-100 text-green-700 border-green-200',
      late: 'bg-orange-100 text-orange-700 border-orange-200',
      absent: 'bg-red-100 text-red-700 border-red-200',
      on_leave: 'bg-amber-100 text-amber-700 border-amber-200',
    };
    const labels = {
      present: 'Present',
      late: 'Late',
      absent: 'Absent',
      on_leave: 'On Leave',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/hrm" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <HiOutlineArrowLeft size={20} className="text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Attendance & Time Tracking</h1>
                <p className="text-sm text-slate-500">Monitor attendance, shifts, and working hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm">
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                <HiOutlineDownload size={18} />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* My Attendance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="text-xs text-indigo-100">{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">My Attendance</h2>
                <p className="text-indigo-100">{isClockedIn ? 'Clocked in at 09:00 AM' : 'You are not clocked in'}</p>
              </div>
            </div>
            <button
              onClick={() => setIsClockedIn(!isClockedIn)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                isClockedIn
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              {isClockedIn ? (
                <><HiOutlineStop size={20} /> Clock Out</>
              ) : (
                <><HiOutlinePlay size={20} /> Clock In</>
              )}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
            <div>
              <p className="text-xs text-indigo-200 mb-1">Shift</p>
              <p className="font-medium">General (9 AM - 6 PM)</p>
            </div>
            <div>
              <p className="text-xs text-indigo-200 mb-1">Worked Today</p>
              <p className="font-medium">04:32:15 hrs</p>
            </div>
            <div>
              <p className="text-xs text-indigo-200 mb-1">Break</p>
              <p className="font-medium">00:45:00 hrs</p>
            </div>
            <div>
              <p className="text-xs text-indigo-200 mb-1">Status</p>
              <p className="font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Active
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {attendanceStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === 'green' ? 'bg-green-50 text-green-600' :
                  stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  stat.color === 'red' ? 'bg-red-50 text-red-600' :
                  'bg-orange-50 text-orange-600'
                }`}>
                  <stat.icon size={20} />
                </div>
              </div>
              {'percentage' in stat ? (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">{stat.percentage}%</span>
                    <span className="text-slate-400">of {stat.total}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        stat.color === 'green' ? 'bg-green-500' :
                        stat.color === 'amber' ? 'bg-amber-500' :
                        stat.color === 'red' ? 'bg-red-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className={`text-xs ${stat.change?.startsWith('-') ? 'text-green-600' : 'text-slate-400'}`}>
                  {stat.change} from yesterday
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Today's Attendance</h2>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-lg">All</button>
                  <button className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Present</button>
                  <button className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Absent</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-3">Employee</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Check In</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Check Out</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Status</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {todayAttendance.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs">
                              {emp.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{emp.name}</p>
                              <p className="text-xs text-slate-500">{emp.id} • {emp.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">{emp.checkIn}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">{emp.checkOut}</span>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(emp.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <HiOutlineLocationMarker size={14} />
                            {emp.location}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Weekly Overview Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 p-6 mt-6"
            >
              <h2 className="font-semibold text-slate-900 mb-4">Weekly Attendance Overview</h2>
              <div className="flex items-end gap-4 h-48">
                {weeklyData.map((day, idx) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col gap-1">
                      <div
                        className="w-full bg-green-500 rounded-t"
                        style={{ height: `${(day.present / 160) * 100}px` }}
                      />
                      <div
                        className="w-full bg-orange-400 rounded-t"
                        style={{ height: `${(day.late / 160) * 20}px` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{day.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span className="text-xs text-slate-600">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded" />
                  <span className="text-xs text-slate-600">Late</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shift Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineClock className="text-slate-400" size={20} />
                <h2 className="font-semibold text-slate-900">Shift Schedule</h2>
              </div>
              <div className="space-y-3">
                {shiftSchedule.map((shift) => (
                  <div
                    key={shift.name}
                    className={`p-3 rounded-lg border ${shift.active ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900">{shift.name}</span>
                      {shift.active && (
                        <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">Active</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">{shift.time}</p>
                    <p className="text-xs text-slate-400 mt-1">{shift.employees} employees assigned</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white"
            >
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-3">
                  <HiOutlineCalendar size={18} />
                  <span>Apply for Leave</span>
                </button>
                <button className="w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-3">
                  <HiOutlineExclamationCircle size={18} />
                  <span>Report Issue</span>
                </button>
                <button className="w-full p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-3">
                  <HiOutlineDeviceMobile size={18} />
                  <span>Mark Attendance</span>
                </button>
              </div>
            </motion.div>

            {/* Integration Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <h2 className="font-semibold text-slate-900 mb-4">Integrations</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <HiOutlineDeviceMobile className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Biometric Device</p>
                      <p className="text-xs text-slate-500">Connected</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <HiOutlineLocationMarker className="text-purple-600" size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Geo-fencing</p>
                      <p className="text-xs text-slate-500">Active</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
