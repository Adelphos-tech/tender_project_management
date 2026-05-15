'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineTrendingUp,
  HiOutlineClipboardList,
  HiOutlineCash,
  HiOutlineDocumentText,
  HiOutlineChartBar,
} from 'react-icons/hi';

const stats = [
  { label: 'Total Employees', value: '24', sub: '3 on leave today', icon: HiOutlineUsers, color: 'blue' },
  { label: 'Present Today', value: '19', sub: '79% attendance', icon: HiOutlineCheckCircle, color: 'green' },
  { label: 'Leave Requests', value: '4', sub: '2 pending approval', icon: HiOutlineCalendar, color: 'amber' },
  { label: 'This Month Payroll', value: '₹4.8L', sub: 'Due on 28th', icon: HiOutlineCash, color: 'purple' },
];

const hrmModules = [
  {
    href: '/hrm/employees',
    title: 'Employees',
    description: 'Employee directory, profiles, documents & contracts',
    icon: HiOutlineUsers,
    color: 'blue',
    stats: '24 active',
  },
  {
    href: '/hrm/attendance',
    title: 'Attendance & Time',
    description: 'Daily attendance, shifts, overtime & timesheets',
    icon: HiOutlineClock,
    color: 'indigo',
    stats: '19 present today',
  },
  {
    href: '/hrm/leave',
    title: 'Leave Management',
    description: 'Leave requests, approvals, balances & calendar',
    icon: HiOutlineCalendar,
    color: 'emerald',
    stats: '4 requests this month',
  },
  {
    href: '/hrm/payroll',
    title: 'Payroll',
    description: 'Salary processing, payslips, deductions & TDS',
    icon: HiOutlineCurrencyDollar,
    color: 'purple',
    stats: '₹4.8L this month',
  },
  {
    href: '/hrm/recruitment',
    title: 'Recruitment & ATS',
    description: 'Job openings, candidates, pipeline & offers',
    icon: HiOutlineBriefcase,
    color: 'rose',
    stats: '3 open positions',
  },
];

const recentActivity = [
  { type: 'leave', text: 'Devang Lakhani applied for 2-day casual leave', time: '2h ago', icon: HiOutlineCalendar, color: 'amber' },
  { type: 'join', text: 'New employee Priya Shah onboarded', time: '1d ago', icon: HiOutlineUsers, color: 'green' },
  { type: 'payroll', text: 'December payroll processed – ₹4.6L disbursed', time: '3d ago', icon: HiOutlineCash, color: 'purple' },
  { type: 'leave', text: 'Ketan Makadiya leave approved (3 days)', time: '4d ago', icon: HiOutlineCheckCircle, color: 'green' },
  { type: 'recruitment', text: 'Interview scheduled for Site Engineer position', time: '5d ago', icon: HiOutlineBriefcase, color: 'rose' },
];

const upcomingEvents = [
  { label: 'Payroll Processing', date: 'Jan 28', type: 'payroll' },
  { label: 'Leave approval – Nikhil Davda', date: 'Jan 22', type: 'leave' },
  { label: 'Site Engineer Interview', date: 'Jan 24', type: 'recruitment' },
  { label: 'Monthly Attendance Review', date: 'Jan 31', type: 'attendance' },
];

const colorMap: Record<string, { bg: string; light: string; text: string; border: string }> = {
  blue:    { bg: 'bg-blue-500',    light: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200' },
  indigo:  { bg: 'bg-indigo-500',  light: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-200' },
  emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  purple:  { bg: 'bg-purple-500',  light: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-200' },
  rose:    { bg: 'bg-rose-500',    light: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200' },
  amber:   { bg: 'bg-amber-500',   light: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200' },
  green:   { bg: 'bg-green-500',   light: 'bg-green-50',   text: 'text-green-600',   border: 'border-green-200' },
  red:     { bg: 'bg-red-500',     light: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200' },
};

const eventTypeBadge: Record<string, string> = {
  payroll:     'bg-purple-100 text-purple-700',
  leave:       'bg-amber-100 text-amber-700',
  recruitment: 'bg-rose-100 text-rose-700',
  attendance:  'bg-indigo-100 text-indigo-700',
};

export default function HRMOverviewPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <HiOutlineUserGroup size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Human Resource Management</h1>
              <p className="text-sm text-slate-500">Overview of all HR activities, staff & operations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[s.color].light} ${colorMap[s.color].text}`}>
                  <s.icon size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Module Cards */}
        <div>
          <h2 className="text-base font-semibold text-slate-700 mb-3">HR Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {hrmModules.map((m, i) => {
              const c = colorMap[m.color];
              return (
                <motion.div key={m.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}>
                  <Link href={m.href}
                    className="group block bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100 transition-all duration-200 overflow-hidden h-full">
                    <div className="p-5">
                      <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform`}>
                        <m.icon size={22} className="text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm mb-1">{m.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">{m.description}</p>
                      <div className={`text-xs font-medium px-2.5 py-1 rounded-full inline-block ${c.light} ${c.text}`}>{m.stats}</div>
                    </div>
                    <div className={`px-5 py-3 border-t ${c.border} ${c.light} flex items-center justify-between`}>
                      <span className={`text-xs font-medium ${c.text}`}>Open Module</span>
                      <HiOutlineArrowRight size={14} className={`${c.text} group-hover:translate-x-1 transition-transform`} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom two-col: Activity + Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Recent Activity</h3>
              <span className="text-xs text-slate-400">Last 7 days</span>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivity.map((a, i) => {
                const c = colorMap[a.color];
                return (
                  <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${c.light} ${c.text} mt-0.5`}>
                      <a.icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 leading-snug">{a.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Upcoming This Month</h3>
              <span className="text-xs text-slate-400">January 2024</span>
            </div>
            <div className="divide-y divide-slate-100">
              {upcomingEvents.map((ev, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-700 w-10 text-center">{ev.date.split(' ')[1]}</span>
                    <div>
                      <p className="text-sm text-slate-800">{ev.label}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${eventTypeBadge[ev.type]}`}>{ev.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Add Employee', href: '/hrm/employees', color: 'blue' },
                  { label: 'Approve Leave', href: '/hrm/leave', color: 'amber' },
                  { label: 'Run Payroll', href: '/hrm/payroll', color: 'purple' },
                  { label: 'Mark Attendance', href: '/hrm/attendance', color: 'indigo' },
                ].map(qa => (
                  <Link key={qa.href} href={qa.href}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-indigo-50 rounded-lg text-xs font-medium text-slate-700 hover:text-indigo-700 transition-colors">
                    <HiOutlineArrowRight size={13} />
                    {qa.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Department Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Staff by Department</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Department', 'Head Count', 'Present Today', 'On Leave', 'Payroll (Monthly)'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { dept: 'Project Management', count: 8, present: 7, leave: 1, payroll: '₹1.6L' },
                  { dept: 'Site Engineering', count: 6, present: 5, leave: 1, payroll: '₹1.1L' },
                  { dept: 'Accounts & Finance', count: 4, present: 3, leave: 1, payroll: '₹80K' },
                  { dept: 'Administration', count: 3, present: 3, leave: 0, payroll: '₹54K' },
                  { dept: 'Field Survey', count: 3, present: 1, leave: 1, payroll: '₹60K' },
                ].map(row => (
                  <tr key={row.dept} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-slate-900">{row.dept}</td>
                    <td className="px-5 py-3 text-sm text-slate-700">{row.count}</td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium text-green-600">{row.present}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-sm font-medium ${row.leave > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{row.leave}</span>
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-slate-900">{row.payroll}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
