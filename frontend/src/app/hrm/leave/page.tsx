'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlineCalendar,
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineHeart,
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineFilter,
  HiOutlineX,
} from 'react-icons/hi';

const leaveStats = [
  { label: 'Total Leaves', value: '24', sublabel: 'Annual entitlement', icon: HiOutlineCalendar, color: 'blue' },
  { label: 'Used', value: '8', sublabel: 'Days taken', icon: HiOutlineCheckCircle, color: 'emerald' },
  { label: 'Remaining', value: '16', sublabel: 'Days available', icon: HiOutlineSun, color: 'amber' },
  { label: 'Pending', value: '2', sublabel: 'Awaiting approval', icon: HiOutlineClock, color: 'orange' },
];

const leaveTypes = [
  { type: 'Casual Leave', icon: HiOutlineSun, color: 'bg-blue-500', total: 12, used: 4, remaining: 8 },
  { type: 'Sick Leave', icon: HiOutlineHeart, color: 'bg-rose-500', total: 10, used: 2, remaining: 8 },
  { type: 'Earned Leave', icon: HiOutlineCalendar, color: 'bg-emerald-500', total: 15, used: 0, remaining: 15 },
  { type: 'Work From Home', icon: HiOutlineHome, color: 'bg-purple-500', total: 12, used: 2, remaining: 10 },
];

const leaveRequests = [
  { id: 'LR-001', employee: 'Rajesh Sharma', type: 'Casual Leave', from: '2024-01-15', to: '2024-01-16', days: 2, reason: 'Family function', status: 'approved', applied: '2024-01-10' },
  { id: 'LR-002', employee: 'Priya Patel', type: 'Sick Leave', from: '2024-01-12', to: '2024-01-12', days: 1, reason: 'Fever', status: 'approved', applied: '2024-01-11' },
  { id: 'LR-003', employee: 'Amit Kumar', type: 'Casual Leave', from: '2024-01-18', to: '2024-01-20', days: 3, reason: 'Personal work', status: 'pending', applied: '2024-01-08' },
  { id: 'LR-004', employee: 'Sneha Gupta', type: 'Work From Home', from: '2024-01-16', to: '2024-01-16', days: 1, reason: 'Internet issue at office', status: 'pending', applied: '2024-01-15' },
  { id: 'LR-005', employee: 'Vikram Singh', type: 'Sick Leave', from: '2024-01-10', to: '2024-01-11', days: 2, reason: 'Stomach infection', status: 'rejected', applied: '2024-01-09' },
];

const teamOnLeave = [
  { name: 'Sneha Gupta', avatar: 'SG', dates: 'Jan 15-17', type: 'Casual Leave' },
  { name: 'Amit Kumar', avatar: 'AK', dates: 'Jan 18-20', type: 'Planned Leave', status: 'upcoming' },
];

export default function LeaveManagementPage() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeTab, setActiveTab] = useState('my_leaves');

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
                <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
                <p className="text-sm text-slate-500">Track and manage leave requests</p>
              </div>
            </div>
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
            >
              <HiOutlinePlus size={18} />
              Apply Leave
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-1 mb-6 inline-flex">
          <button
            onClick={() => setActiveTab('my_leaves')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'my_leaves' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Leaves
          </button>
          <button
            onClick={() => setActiveTab('team_leaves')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'team_leaves' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Team Leaves
          </button>
          <button
            onClick={() => setActiveTab('leave_calendar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'leave_calendar' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Leave Calendar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {leaveStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.sublabel}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  'bg-orange-50 text-orange-600'
                }`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Balance Cards */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Leave Balance</h2>
              <div className="grid grid-cols-2 gap-4">
                {leaveTypes.map((leave) => (
                  <motion.div
                    key={leave.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 ${leave.color} rounded-lg flex items-center justify-center text-white`}>
                        <leave.icon size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{leave.type}</p>
                        <p className="text-xs text-slate-500">{leave.remaining} days left</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Used: {leave.used}</span>
                        <span className="text-slate-500">Total: {leave.total}</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${leave.color} rounded-full transition-all`}
                          style={{ width: `${(leave.remaining / leave.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Leave History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Leave History</h2>
                <button className="p-2 hover:bg-slate-100 rounded-lg">
                  <HiOutlineFilter size={18} className="text-slate-600" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-3">Request</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Type</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Duration</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Days</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Status</th>
                      <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leaveRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs">
                              {request.employee.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{request.employee}</p>
                              <p className="text-xs text-slate-500">{request.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-slate-700">{request.type}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <p className="text-slate-900">{new Date(request.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(request.to).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-slate-900">{request.days} days</span>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                              <HiOutlineEye size={16} />
                            </button>
                            {request.status === 'pending' && (
                              <>
                                <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                                  <HiOutlineCheckCircle size={16} />
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                  <HiOutlineXCircle size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">January 2024</h2>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-slate-100 rounded"><span>‹</span></button>
                  <button className="p-1 hover:bg-slate-100 rounded"><span>›</span></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <div key={day} className="py-1 text-slate-500 font-medium">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const isWeekend = day % 7 === 0 || day % 7 === 6;
                  const isLeave = [15, 16, 18, 19, 20].includes(day);
                  const isToday = day === 13;

                  return (
                    <button
                      key={day}
                      className={`aspect-square rounded-lg text-sm flex items-center justify-center ${
                        isToday ? 'bg-indigo-600 text-white' :
                        isLeave ? 'bg-amber-100 text-amber-700' :
                        isWeekend ? 'bg-slate-100 text-slate-400' :
                        'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-indigo-600" />
                  <span className="text-slate-600">Today</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-amber-100" />
                  <span className="text-slate-600">Leave</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-slate-100" />
                  <span className="text-slate-600">Weekend</span>
                </div>
              </div>
            </motion.div>

            {/* Team on Leave */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineUserGroup className="text-slate-400" size={20} />
                <h2 className="font-semibold text-slate-900">Team on Leave</h2>
              </div>

              <div className="space-y-3">
                {teamOnLeave.map((member) => (
                  <div key={member.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.dates} • {member.type}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                View All Team Leaves
              </button>
            </motion.div>

            {/* Company Holidays */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white"
            >
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineCalendar size={20} />
                <h3 className="font-semibold">Upcoming Holidays</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex flex-col items-center justify-center text-center">
                    <span className="text-xs">JAN</span>
                    <span className="font-bold">26</span>
                  </div>
                  <div>
                    <p className="font-medium">Republic Day</p>
                    <p className="text-xs text-indigo-100">Public Holiday</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex flex-col items-center justify-center text-center">
                    <span className="text-xs">MAR</span>
                    <span className="font-bold">25</span>
                  </div>
                  <div>
                    <p className="font-medium">Holi</p>
                    <p className="text-xs text-indigo-100">Public Holiday</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Apply for Leave</h2>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600">
                <HiOutlineX size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Select leave type</option>
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Earned Leave</option>
                  <option>Work From Home</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
                  <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
                  <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter reason for leave..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notify</label>
                <div className="flex flex-wrap gap-2">
                  {['Manager', 'HR', 'Team Lead'].map((role) => (
                    <label key={role} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg cursor-pointer">
                      <input type="checkbox" defaultChecked={role === 'Manager'} className="rounded text-indigo-600" />
                      <span className="text-sm text-slate-700">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowApplyModal(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800">Cancel</button>
              <button onClick={() => setShowApplyModal(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Submit Request</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
