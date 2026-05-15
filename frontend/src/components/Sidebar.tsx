'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/context/SocketContext';
import {
  HiOutlineHome,
  HiOutlineTruck,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineMap,
  HiOutlineCurrencyDollar,
  HiOutlineChartBar,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineBell,
  HiOutlineBriefcase,
  HiOutlineCash,
  HiOutlineDocumentText,
  HiOutlineIdentification,
  HiChevronDown,
  HiChevronRight,
  HiOutlineShieldCheck,
  HiOutlineCog,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineClipboardCheck,
  HiOutlineOfficeBuilding,
  HiOutlineInboxIn,
  HiOutlineCreditCard,
} from 'react-icons/hi';

interface NavItem {
  key: string;
  href: string;
  icon: React.ReactNode;
  label: string;
  module: string;
}

export default function Sidebar() {
  const { user, logout, canAccessModule } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>(['vehicleManagement']);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const mainNavItems: NavItem[] = [];
  if (canAccessModule('dashboard')) {
    mainNavItems.push({ key: 'dashboard', href: '/dashboard', icon: <HiOutlineHome size={20} />, label: 'Dashboard', module: 'dashboard' });
  }
  if (canAccessModule('vehicles')) {
    mainNavItems.push({ key: 'vehicles', href: '/vehicles', icon: <HiOutlineTruck size={20} />, label: 'Vehicles', module: 'vehicles' });
  }
  if (canAccessModule('drivers')) {
    mainNavItems.push({ key: 'drivers', href: '/drivers', icon: <HiOutlineUsers size={20} />, label: 'Drivers', module: 'drivers' });
  }
  if (canAccessModule('inquiries')) {
    mainNavItems.push({ key: 'inquiries', href: '/trip-inquiries', icon: <HiOutlineClipboardList size={20} />, label: 'Trip Inquiries', module: 'inquiries' });
  }
  if (canAccessModule('trips')) {
    mainNavItems.push({ key: 'trips', href: '/trips', icon: <HiOutlineMap size={20} />, label: 'Trips', module: 'trips' });
  }
  if (canAccessModule('expenses')) {
    mainNavItems.push({ key: 'expenses', href: '/expenses', icon: <HiOutlineCurrencyDollar size={20} />, label: 'Expenses', module: 'expenses' });
  }
  if (canAccessModule('reports')) {
    mainNavItems.push({ key: 'reports', href: '/reports', icon: <HiOutlineChartBar size={20} />, label: 'Reports', module: 'reports' });
  }
  if (canAccessModule('documents')) {
    mainNavItems.push({ key: 'documents', href: '/invert-outvert', icon: <HiOutlineDocumentText size={20} />, label: 'Documents', module: 'documents' });
  }

  const projectMasterItems: NavItem[] = [];
  if (canAccessModule('fundFlow')) {
    projectMasterItems.push({ key: 'fundFlow', href: '/project-master/fund-flow', icon: <HiOutlineCash size={20} />, label: 'Fund Flow', module: 'fundFlow' });
  }
  if (canAccessModule('consultancyBill')) {
    projectMasterItems.push({ key: 'consultancyBill', href: '/project-master/consultancy-bill', icon: <HiOutlineDocumentText size={20} />, label: 'Consultancy Bill', module: 'consultancyBill' });
  }
  if (canAccessModule('contractorBill')) {
    projectMasterItems.push({ key: 'contractorBill', href: '/project-master/contractor-bill', icon: <HiOutlineIdentification size={20} />, label: 'Contractor Bill', module: 'contractorBill' });
  }
  if (canAccessModule('tender')) {
    projectMasterItems.push({ key: 'tender', href: '/project-master/tender', icon: <HiOutlineBriefcase size={20} />, label: 'Tender', module: 'tender' });
  }
  if (canAccessModule('wip')) {
    projectMasterItems.push({ key: 'wip', href: '/project-master/wip', icon: <HiOutlineClipboardCheck size={20} />, label: 'WIP', module: 'wip' });
  }
  if (canAccessModule('property')) {
    projectMasterItems.push({ key: 'property', href: '/project-master/property', icon: <HiOutlineOfficeBuilding size={20} />, label: 'Property List', module: 'property' });
  }
  if (canAccessModule('inout')) {
    projectMasterItems.push({ key: 'inout', href: '/project-master/inout', icon: <HiOutlineInboxIn size={20} />, label: 'In-Out Register', module: 'inout' });
  }
  if (canAccessModule('paymentSchedules')) {
    projectMasterItems.push({ key: 'paymentSchedules', href: '/project-master/payment-schedules', icon: <HiOutlineCreditCard size={20} />, label: 'Payment Schedules', module: 'paymentSchedules' });
  }
  if (canAccessModule('vehicleLogbook')) {
    projectMasterItems.push({ key: 'vehicleLogbook', href: '/project-master/vehicle-logbook', icon: <HiOutlineTruck size={20} />, label: 'Vehicle Logbook', module: 'vehicleLogbook' });
  }

  const hrmItems: NavItem[] = [];
  if (canAccessModule('hrm') || user?.role === 'admin') {
    hrmItems.push({ key: 'hrm', href: '/hrm', icon: <HiOutlineUserGroup size={20} />, label: 'HRM Overview', module: 'hrm' });
    hrmItems.push({ key: 'employees', href: '/hrm/employees', icon: <HiOutlineUsers size={20} />, label: 'Employees', module: 'hrm' });
    hrmItems.push({ key: 'payroll', href: '/hrm/payroll', icon: <HiOutlineCurrencyDollar size={20} />, label: 'Payroll', module: 'hrm' });
    hrmItems.push({ key: 'leave', href: '/hrm/leave', icon: <HiOutlineCalendar size={20} />, label: 'Leave', module: 'hrm' });
    hrmItems.push({ key: 'attendance', href: '/hrm/attendance', icon: <HiOutlineClock size={20} />, label: 'Attendance', module: 'hrm' });
    hrmItems.push({ key: 'recruitment', href: '/hrm/recruitment', icon: <HiOutlineBriefcase size={20} />, label: 'Recruitment', module: 'hrm' });
  }

  const adminItems: NavItem[] = [];
  if (canAccessModule('roleManagement')) {
    adminItems.push({ key: 'roleManagement', href: '/admin/roles', icon: <HiOutlineShieldCheck size={20} />, label: 'Rights Management', module: 'roleManagement' });
  }
  if (canAccessModule('userManagement')) {
    adminItems.push({ key: 'userManagement', href: '/admin/users', icon: <HiOutlineUserGroup size={20} />, label: 'User Management', module: 'userManagement' });
  }
  if (canAccessModule('settings')) {
    adminItems.push({ key: 'settings', href: '/settings', icon: <HiOutlineCog size={20} />, label: 'Settings', module: 'settings' });
  }

  const toggleModule = (module: string) => {
    setExpandedModules((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    );
  };

  const isModuleExpanded = (module: string) => expandedModules.includes(module);

  const handleNotificationClick = (notif: any) => {
    if (!notif.isRead) markAsRead(notif._id);
    setNotificationsOpen(false);
    setMobileOpen(false);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Close Button (Mobile) */}
      <button
        onClick={() => setMobileOpen(false)}
        className="absolute top-4 right-4 z-50 p-2 text-slate-400 hover:text-white lg:hidden bg-slate-800/50 rounded-lg"
      >
        <HiOutlineX size={24} />
      </button>

      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <HiOutlineTruck size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">OpsERP</h1>
            <p className="text-xs text-slate-400">Enterprise Operations Suite</p>
          </div>
        </div>
      </div>

      {/* Language Switcher */}
      <div className="px-6 py-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Language</span>
          <div className="flex gap-1">
            {(['en', 'hi', 'gu'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${
                  language === lang
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Main Navigation */}
        {mainNavItems.length > 0 && (
          <div className="mb-2">
            <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Main Menu</div>
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Project Master Module */}
        {projectMasterItems.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <Link
                href="/project-master"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
              >
                <HiOutlineBriefcase size={16} />
                <span>Project Master</span>
              </Link>
              <button
                onClick={() => toggleModule('projectMaster')}
                className="px-2 py-2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {isModuleExpanded('projectMaster') ? <HiChevronDown size={16} /> : <HiChevronRight size={16} />}
              </button>
            </div>

            <AnimatePresence>
              {isModuleExpanded('projectMaster') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 mt-1">
                    {projectMasterItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white pl-8'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* HRM Section */}
        {hrmItems.length > 0 && (
          <div className="mb-2">
            <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Human Resources</div>
            <div className="space-y-1">
              {hrmItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Admin Section */}
        {adminItems.length > 0 && (
          <div className="mb-2">
            <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Administration</div>
            <div className="space-y-1">
              {adminItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* User Info & Notifications */}
      <div className="px-3 py-4 border-t border-slate-800">
        {/* Notifications (Desktop) */}
        <div className="hidden lg:block mb-4 relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <div className="flex items-center gap-3 text-sm font-medium">
              <div className="relative">
                <HiOutlineBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-slate-900"></span>
                  </span>
                )}
              </div>
              <span>Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-red-500/20 text-red-400 py-0.5 px-2 rounded-full text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={() => markAllAsRead()} className="text-xs text-indigo-400 hover:text-indigo-300">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-400">No notifications</div>
                  ) : (
                    notifications.map((notif: any) => (
                      <div
                        key={notif._id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 border-b border-slate-700/50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-slate-700/30 hover:bg-slate-700/50' : 'opacity-70 hover:bg-slate-700/30'}`}
                      >
                        <h4 className={`text-xs mb-1 ${!notif.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>{notif.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-tight">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Card */}
        <div className="px-4 py-3 mb-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                {user.role}
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-4 py-2.5 w-full rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all duration-200"
        >
          <HiOutlineLogout size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Mobile Top Navigation */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-30 lg:hidden flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 -ml-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <HiOutlineMenu size={24} />
          </button>
          <div className="flex items-center gap-2 text-white font-bold">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <HiOutlineTruck size={16} className="text-white" />
            </div>
            <span className="tracking-tight">OpsERP</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white relative"
          >
            <HiOutlineBell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-slate-900"></span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Notifications Panel */}
      <AnimatePresence>
        {notificationsOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-0 left-0 z-40 lg:hidden"
          >
            <div className="bg-slate-800 border-b border-slate-700 shadow-2xl">
              <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={() => markAllAsRead()} className="text-xs text-indigo-400 hover:text-indigo-300">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-400">No notifications</div>
                ) : (
                  notifications.map((notif: any) => (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3 border-b border-slate-700/50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-slate-700/30' : 'opacity-70'}`}
                    >
                      <h4 className={`text-xs mb-1 ${!notif.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>{notif.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-tight">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (always visible) */}
      <aside className="hidden lg:flex fixed top-0 left-0 z-50 h-screen w-72 bg-slate-900 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (animated drawer) */}
      <motion.aside
        initial={false}
        animate={{ x: mobileOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 z-50 h-screen w-72 bg-slate-900 lg:hidden"
      >
        {sidebarContent}
      </motion.aside>
    </div>
  );
}
