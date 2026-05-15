'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlineUsers,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlinePlus,
  HiOutlineDownload,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineOfficeBuilding,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineDotsVertical,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineArrowLeft,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
} from 'react-icons/hi';

// Mock employee data
const mockEmployees = [
  { id: 'EMP001', name: 'Rajesh Sharma', email: 'rajesh.s@opserp.com', phone: '+91 98765 43210', department: 'Operations', designation: 'Operations Manager', joinDate: '2023-01-15', status: 'active', avatar: 'RS', location: 'Mumbai HQ' },
  { id: 'EMP002', name: 'Priya Patel', email: 'priya.p@opserp.com', phone: '+91 98765 43211', department: 'HR', designation: 'HR Manager', joinDate: '2023-02-01', status: 'active', avatar: 'PP', location: 'Mumbai HQ' },
  { id: 'EMP003', name: 'Amit Kumar', email: 'amit.k@opserp.com', phone: '+91 98765 43212', department: 'Finance', designation: 'Accountant', joinDate: '2023-03-10', status: 'active', avatar: 'AK', location: 'Delhi Branch' },
  { id: 'EMP004', name: 'Sneha Gupta', email: 'sneha.g@opserp.com', phone: '+91 98765 43213', department: 'Operations', designation: 'Driver Supervisor', joinDate: '2023-04-05', status: 'on_leave', avatar: 'SG', location: 'Bangalore Branch' },
  { id: 'EMP005', name: 'Vikram Singh', email: 'vikram.s@opserp.com', phone: '+91 98765 43214', department: 'Maintenance', designation: 'Lead Mechanic', joinDate: '2023-05-20', status: 'active', avatar: 'VS', location: 'Mumbai HQ' },
  { id: 'EMP006', name: 'Anita Desai', email: 'anita.d@opserp.com', phone: '+91 98765 43215', department: 'Sales', designation: 'Sales Executive', joinDate: '2023-06-12', status: 'inactive', avatar: 'AD', location: 'Chennai Branch' },
  { id: 'EMP007', name: 'Rahul Verma', email: 'rahul.v@opserp.com', phone: '+91 98765 43216', department: 'IT', designation: 'System Admin', joinDate: '2023-07-01', status: 'active', avatar: 'RV', location: 'Mumbai HQ' },
  { id: 'EMP008', name: 'Neha Sharma', email: 'neha.s@opserp.com', phone: '+91 98765 43217', department: 'Operations', designation: 'Dispatcher', joinDate: '2023-08-15', status: 'active', avatar: 'NS', location: 'Delhi Branch' },
];

const departments = ['All', 'Operations', 'HR', 'Finance', 'Maintenance', 'Sales', 'IT'];
const statuses = ['All', 'Active', 'On Leave', 'Inactive'];

const stats = [
  { label: 'Total Employees', value: 156, change: '+12%', icon: HiOutlineUsers, color: 'blue' },
  { label: 'Active Now', value: 142, change: '+8%', icon: HiOutlineCheckCircle, color: 'green' },
  { label: 'On Leave', value: 8, change: '-2%', icon: HiOutlineClock, color: 'amber' },
  { label: 'New Joiners', value: 6, change: 'This month', icon: HiOutlineChartBar, color: 'purple' },
];

export default function EmployeeManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const filteredEmployees = mockEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus.toLowerCase().replace(' ', '_');
    return matchesSearch && matchesDept && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      on_leave: 'bg-amber-100 text-amber-700 border-amber-200',
      inactive: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    const labels = {
      active: 'Active',
      on_leave: 'On Leave',
      inactive: 'Inactive',
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
                <h1 className="text-2xl font-bold text-slate-900">Employee Management</h1>
                <p className="text-sm text-slate-500">Manage your workforce - {mockEmployees.length} employees</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                <HiOutlineDownload size={18} />
                Export
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <HiOutlinePlus size={18} />
                Add Employee
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => (
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
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.change.includes('+') ? 'text-green-600' : 'text-slate-400'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  stat.color === 'green' ? 'bg-green-50 text-green-600' :
                  stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or employee ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status === 'All' ? 'All Status' : status}</option>
                ))}
              </select>
              <button className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                <HiOutlineFilter size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Employee</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Contact</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Department</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Join Date</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                          {employee.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{employee.name}</p>
                          <p className="text-xs text-slate-500">{employee.id} • {employee.designation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <HiOutlineMail size={14} className="text-slate-400" />
                          {employee.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <HiOutlinePhone size={14} className="text-slate-400" />
                          {employee.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <HiOutlineOfficeBuilding size={16} className="text-slate-400" />
                        <span className="text-sm text-slate-700">{employee.department}</span>
                      </div>
                      <p className="text-xs text-slate-500 ml-6">{employee.location}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(employee.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <HiOutlineCalendar size={14} className="text-slate-400" />
                        {new Date(employee.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedEmployee(employee)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <HiOutlineEye size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <HiOutlinePencil size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <HiOutlineTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-sm text-slate-500">Showing {filteredEmployees.length} of {mockEmployees.length} employees</p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Previous</button>
              <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg">1</button>
              <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">2</button>
              <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">3</button>
              <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Next</button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <HiOutlineDocumentText size={20} />
              </div>
              <h3 className="font-semibold">Document Vault</h3>
            </div>
            <p className="text-sm text-blue-100 mb-4">Manage employee documents, contracts, and certificates</p>
            <button className="text-sm font-medium text-white hover:text-blue-100 flex items-center gap-1">
              Open Vault →
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <HiOutlineBriefcase size={20} />
              </div>
              <h3 className="font-semibold">Onboarding</h3>
            </div>
            <p className="text-sm text-emerald-100 mb-4">Streamline new employee onboarding process</p>
            <button className="text-sm font-medium text-white hover:text-emerald-100 flex items-center gap-1">
              Start Onboarding →
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <HiOutlineChartBar size={20} />
              </div>
              <h3 className="font-semibold">Analytics</h3>
            </div>
            <p className="text-sm text-purple-100 mb-4">View workforce analytics and headcount reports</p>
            <button className="text-sm font-medium text-white hover:text-purple-100 flex items-center gap-1">
              View Reports →
            </button>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Add New Employee</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <HiOutlineXCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                    <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID *</label>
                    <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="EMP-XXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                    <input type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="email@company.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                    <input type="tel" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
              </div>

              {/* Employment Info */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Employment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Select department</option>
                      <option>Operations</option>
                      <option>HR</option>
                      <option>Finance</option>
                      <option>IT</option>
                      <option>Sales</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Designation *</label>
                    <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Job title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Join Date *</label>
                    <input type="date" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Select location</option>
                      <option>Mumbai HQ</option>
                      <option>Delhi Branch</option>
                      <option>Bangalore Branch</option>
                      <option>Chennai Branch</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Documents</h3>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                  <HiOutlineDocumentText size={40} className="mx-auto text-slate-400 mb-3" />
                  <p className="text-sm text-slate-600 mb-1">Drag and drop documents here, or click to browse</p>
                  <p className="text-xs text-slate-400">Supports PDF, JPG, PNG up to 10MB each</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Employee
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
              >
                <HiOutlineXCircle size={20} />
              </button>
            </div>
            <div className="px-6 pb-6">
              <div className="relative -mt-12 mb-4 flex items-end justify-between">
                <div className="flex items-end gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                    {selectedEmployee.avatar}
                  </div>
                  <div className="mb-1">
                    <h2 className="text-2xl font-bold text-slate-900">{selectedEmployee.name}</h2>
                    <p className="text-slate-500">{selectedEmployee.designation} • {selectedEmployee.department}</p>
                  </div>
                </div>
                {getStatusBadge(selectedEmployee.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <HiOutlineMail className="text-slate-400" size={18} />
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="text-sm font-medium text-slate-900">{selectedEmployee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <HiOutlinePhone className="text-slate-400" size={18} />
                      <div>
                        <p className="text-xs text-slate-500">Phone</p>
                        <p className="text-sm font-medium text-slate-900">{selectedEmployee.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <HiOutlineOfficeBuilding className="text-slate-400" size={18} />
                      <div>
                        <p className="text-xs text-slate-500">Location</p>
                        <p className="text-sm font-medium text-slate-900">{selectedEmployee.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Employment Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <HiOutlineBriefcase className="text-slate-400" size={18} />
                      <div>
                        <p className="text-xs text-slate-500">Employee ID</p>
                        <p className="text-sm font-medium text-slate-900">{selectedEmployee.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <HiOutlineCalendar className="text-slate-400" size={18} />
                      <div>
                        <p className="text-xs text-slate-500">Join Date</p>
                        <p className="text-sm font-medium text-slate-900">{new Date(selectedEmployee.joinDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <HiOutlineDocumentText className="text-slate-400" size={18} />
                      <div>
                        <p className="text-xs text-slate-500">Documents</p>
                        <p className="text-sm font-medium text-slate-900">5 files uploaded</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 flex gap-3">
                <button className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Edit Profile
                </button>
                <button className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                  View Documents
                </button>
                <button className="px-4 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                  Deactivate
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
