'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlineBriefcase,
  HiOutlineArrowRight,
  HiOutlineCash,
  HiOutlineDocumentText,
  HiOutlineIdentification,
  HiOutlineClipboardList,
  HiOutlineOfficeBuilding,
  HiOutlineInboxIn,
  HiOutlineCreditCard,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineCurrencyRupee,
  HiOutlineChartBar,
  HiOutlineCalendar,
} from 'react-icons/hi';

const modules = [
  {
    href: '/project-master/fund-flow',
    title: 'Fund Flow',
    description: 'Track project funds, inflows, outflows & financial status',
    icon: HiOutlineCash,
    color: 'emerald',
    badge: '12 projects',
  },
  {
    href: '/project-master/tender',
    title: 'Tender Management',
    description: 'Track tender applications, EMD, bidding dates & status',
    icon: HiOutlineBriefcase,
    color: 'blue',
    badge: '38 tenders',
  },
  {
    href: '/project-master/wip',
    title: 'Work In Progress',
    description: 'Active projects, RA bills, LOI, agreements & coordinators',
    icon: HiOutlineClipboardList,
    color: 'indigo',
    badge: '11 active',
  },
  {
    href: '/project-master/consultancy-bill',
    title: 'Consultancy Bills',
    description: 'Invoices with GST/TDS calculation & payment tracking',
    icon: HiOutlineDocumentText,
    color: 'violet',
    badge: '42 invoices',
  },
  {
    href: '/project-master/contractor-bill',
    title: 'Contractor Bills',
    description: 'Contractor invoice management & payment status',
    icon: HiOutlineIdentification,
    color: 'orange',
    badge: 'Manage bills',
  },
  {
    href: '/project-master/property',
    title: 'Property List',
    description: 'Assets, warranties, assignments & service reminders',
    icon: HiOutlineOfficeBuilding,
    color: 'teal',
    badge: '86 assets',
  },
  {
    href: '/project-master/inout',
    title: 'In-Out Register',
    description: 'Inward/outward documents, to-do tasks & reply tracking',
    icon: HiOutlineInboxIn,
    color: 'rose',
    badge: '18 pending',
  },
  {
    href: '/project-master/payment-schedules',
    title: 'Payment Schedules',
    description: 'GST, TDS, vehicle loans & all scheduled payments',
    icon: HiOutlineCreditCard,
    color: 'purple',
    badge: '3 overdue',
  },
  {
    href: '/project-master/vehicle-logbook',
    title: 'Vehicle Log Book',
    description: 'Vehicle trips, KM tracking, fuel & maintenance logs',
    icon: HiOutlineTruck,
    color: 'cyan',
    badge: '248 trips',
  },
];

const colorMap: Record<string, { bg: string; light: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  blue:    { bg: 'bg-blue-500',    light: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200' },
  indigo:  { bg: 'bg-indigo-500',  light: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-200' },
  violet:  { bg: 'bg-violet-500',  light: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200' },
  orange:  { bg: 'bg-orange-500',  light: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-200' },
  teal:    { bg: 'bg-teal-500',    light: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-200' },
  rose:    { bg: 'bg-rose-500',    light: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200' },
  purple:  { bg: 'bg-purple-500',  light: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-200' },
  cyan:    { bg: 'bg-cyan-500',    light: 'bg-cyan-50',    text: 'text-cyan-600',    border: 'border-cyan-200' },
};

const summaryStats = [
  { label: 'Active Projects', value: '11', icon: HiOutlineClipboardList, color: 'blue' },
  { label: 'Total Invoiced', value: '₹28.4L', icon: HiOutlineCurrencyRupee, color: 'indigo' },
  { label: 'Tenders Won', value: '18', icon: HiOutlineCheckCircle, color: 'green' },
  { label: 'Pending Replies', value: '18', icon: HiOutlineClock, color: 'amber' },
  { label: 'Overdue Payments', value: '3', icon: HiOutlineExclamationCircle, color: 'red' },
  { label: 'Assets Tracked', value: '86', icon: HiOutlineOfficeBuilding, color: 'teal' },
];

const statColor: Record<string, string> = {
  blue:   'bg-blue-50 text-blue-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  green:  'bg-green-50 text-green-600',
  amber:  'bg-amber-50 text-amber-600',
  red:    'bg-red-50 text-red-600',
  teal:   'bg-teal-50 text-teal-600',
};

const recentActivity = [
  { text: 'RA Bill #2 added to Road Construction – Rajkot Phase 2', time: '2h ago', color: 'indigo' },
  { text: 'Tender TND-005 marked as Won – Drainage Work', time: '5h ago', color: 'green' },
  { text: 'Invoice SAEC/INV/2024/003 – ₹80K received (partial)', time: '1d ago', color: 'blue' },
  { text: 'In-Out: Reply pending for GMB/XEN/C/BVC/PB/339 (18 days old)', time: '2d ago', color: 'red' },
  { text: 'Vehicle Log: VLB-003 approved – Jamnagar trip (315 km)', time: '3d ago', color: 'cyan' },
  { text: 'GST payment ₹45,600 scheduled for Jan 20', time: '4d ago', color: 'purple' },
];

const actColor: Record<string, string> = {
  indigo: 'bg-indigo-50 text-indigo-600',
  green:  'bg-green-50 text-green-600',
  blue:   'bg-blue-50 text-blue-600',
  red:    'bg-red-50 text-red-600',
  cyan:   'bg-cyan-50 text-cyan-600',
  purple: 'bg-purple-50 text-purple-600',
};

export default function ProjectMasterOverviewPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <HiOutlineBriefcase size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Project Master</h1>
              <p className="text-sm text-slate-500">Overview of all project operations, billing, tenders & assets</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {summaryStats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${statColor[s.color]}`}>
                <s.icon size={18} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Module Grid */}
        <div>
          <h2 className="text-base font-semibold text-slate-700 mb-3">Project Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m, i) => {
              const c = colorMap[m.color];
              return (
                <motion.div key={m.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                  <Link href={m.href}
                    className="group flex items-start gap-4 bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-200">
                    <div className={`w-12 h-12 flex-shrink-0 ${c.bg} rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <m.icon size={22} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-900 text-sm">{m.title}</h3>
                        <HiOutlineArrowRight size={14} className="text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-2">{m.description}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.light} ${c.text}`}>{m.badge}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Recent Activity</h3>
              <span className="text-xs text-slate-400">All modules</span>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${actColor[a.color].replace('text-', 'bg-').split(' ')[0]}`} />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 leading-snug">{a.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Access & Alerts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="space-y-4">

            {/* Alerts */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Alerts & Reminders</h3>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { text: '3 payment schedules are overdue', href: '/project-master/payment-schedules', color: 'red', icon: HiOutlineExclamationCircle },
                  { text: '6 in-out replies pending 15+ days', href: '/project-master/inout', color: 'amber', icon: HiOutlineClock },
                  { text: '5 assets warranty expiring in 180 days', href: '/project-master/property', color: 'amber', icon: HiOutlineCalendar },
                  { text: '4 vehicle log entries pending approval', href: '/project-master/vehicle-logbook', color: 'blue', icon: HiOutlineTruck },
                ].map((alert, i) => (
                  <Link key={i} href={alert.href}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      alert.color === 'red' ? 'bg-red-50 border-red-200 hover:bg-red-100' :
                      alert.color === 'amber' ? 'bg-amber-50 border-amber-200 hover:bg-amber-100' :
                      'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    }`}>
                    <alert.icon size={16} className={
                      alert.color === 'red' ? 'text-red-600' :
                      alert.color === 'amber' ? 'text-amber-600' : 'text-blue-600'
                    } />
                    <span className={`text-sm font-medium ${
                      alert.color === 'red' ? 'text-red-800' :
                      alert.color === 'amber' ? 'text-amber-800' : 'text-blue-800'
                    }`}>{alert.text}</span>
                    <HiOutlineArrowRight size={13} className="ml-auto text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Quick Actions</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {[
                  { label: 'New Tender', href: '/project-master/tender', color: 'blue' },
                  { label: 'Add WIP Project', href: '/project-master/wip', color: 'indigo' },
                  { label: 'Create Invoice', href: '/project-master/consultancy-bill', color: 'violet' },
                  { label: 'Log Vehicle Trip', href: '/project-master/vehicle-logbook', color: 'cyan' },
                  { label: 'Add In-Out Entry', href: '/project-master/inout', color: 'rose' },
                  { label: 'Schedule Payment', href: '/project-master/payment-schedules', color: 'purple' },
                ].map(qa => (
                  <Link key={qa.href} href={qa.href}
                    className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-indigo-50 rounded-lg text-xs font-medium text-slate-700 hover:text-indigo-700 transition-colors border border-slate-100 hover:border-indigo-200">
                    <HiOutlineArrowRight size={13} />
                    {qa.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
