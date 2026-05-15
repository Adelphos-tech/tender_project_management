'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlineCurrencyDollar,
  HiOutlineArrowLeft,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineDownload,
  HiOutlineCalculator,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamation,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineChevronDown,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineCash,
  HiOutlineReceiptTax,
  HiOutlineSparkles,
  HiOutlineX,
  HiOutlineOfficeBuilding,
} from 'react-icons/hi';

const payrollStats = [
  { label: 'Total Payroll', value: '₹12,45,000', change: '+5.2%', icon: HiOutlineCurrencyDollar, color: 'blue' },
  { label: 'Processed', value: '142', change: '98%', icon: HiOutlineCheckCircle, color: 'green' },
  { label: 'Pending', value: '14', change: 'Action needed', icon: HiOutlineClock, color: 'amber' },
  { label: 'Avg Salary', value: '₹45,200', change: '+2.1%', icon: HiOutlineTrendingUp, color: 'purple' },
];

const employees = [
  { id: 'EMP001', name: 'Rajesh Sharma', department: 'Operations', basic: 45000, hra: 18000, da: 9000, pf: 5400, tds: 2500, net: 64100 },
  { id: 'EMP002', name: 'Priya Patel', department: 'HR', basic: 55000, hra: 22000, da: 11000, pf: 6600, tds: 3500, net: 76900 },
  { id: 'EMP003', name: 'Amit Kumar', department: 'Finance', basic: 48000, hra: 19200, da: 9600, pf: 5760, tds: 2800, net: 68240 },
  { id: 'EMP004', name: 'Sneha Gupta', department: 'Operations', basic: 42000, hra: 16800, da: 8400, pf: 5040, tds: 2200, net: 59960 },
  { id: 'EMP005', name: 'Vikram Singh', department: 'Maintenance', basic: 38000, hra: 15200, da: 7600, pf: 4560, tds: 1800, net: 54440 },
];

const recentPayslips = [
  { id: 'PS-2024-001', employee: 'Rajesh Sharma', month: 'January 2024', amount: 64100, status: 'paid', date: '2024-01-05' },
  { id: 'PS-2024-002', employee: 'Priya Patel', month: 'January 2024', amount: 76900, status: 'paid', date: '2024-01-05' },
  { id: 'PS-2024-003', employee: 'Amit Kumar', month: 'January 2024', amount: 68240, status: 'pending', date: '-' },
  { id: 'PS-2024-004', employee: 'Sneha Gupta', month: 'January 2024', amount: 59960, status: 'processing', date: '-' },
];

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState('January 2024');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPayslip, setShowPayslip] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]);

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
                <h1 className="text-2xl font-bold text-slate-900">Payroll Processing</h1>
                <p className="text-sm text-slate-500">Manage salaries, deductions, and payslips</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium"
              >
                <option>January 2024</option>
                <option>December 2023</option>
                <option>November 2023</option>
              </select>
              <button
                onClick={() => setShowCalculator(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
              >
                <HiOutlineCalculator size={18} />
                Salary Calculator
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {payrollStats.map((stat, idx) => (
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
                  <p className={`text-xs mt-1 ${stat.change.includes('+') ? 'text-green-600' : stat.change.includes('-') ? 'text-red-600' : 'text-amber-600'}`}>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payroll Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Salary Breakdown</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64"
                  />
                </div>
                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <HiOutlineFilter size={18} className="text-slate-600" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-3">Employee</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">Basic</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">HRA</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">DA</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">Deductions</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-3">Net Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs">
                            {emp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{emp.name}</p>
                            <p className="text-xs text-slate-500">{emp.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-slate-700">₹{emp.basic.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-sm text-slate-700">₹{emp.hra.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-sm text-slate-700">₹{emp.da.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-sm text-red-600">-₹{(emp.pf + emp.tds).toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-semibold text-slate-900">₹{emp.net.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Total Net Pay: <span className="font-semibold text-slate-900">₹3,23,600</span></p>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-white">
                    <HiOutlineDownload size={16} />
                    Export
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
                    Process Payroll
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Payslips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Recent Payslips</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {recentPayslips.map((payslip) => (
                <div key={payslip.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500">{payslip.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      payslip.status === 'paid' ? 'bg-green-100 text-green-700' :
                      payslip.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {payslip.status}
                    </span>
                  </div>
                  <p className="font-medium text-slate-900">{payslip.employee}</p>
                  <p className="text-sm text-slate-500">{payslip.month}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-semibold text-slate-900">₹{payslip.amount.toLocaleString()}</span>
                    <button
                      onClick={() => { setSelectedEmployee(employees.find(e => e.name === payslip.employee) || employees[0]); setShowPayslip(true); }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <HiOutlineEye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-200">
              <button className="w-full py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
                View All Payslips
              </button>
            </div>
          </motion.div>
        </div>

        {/* Salary Components */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <HiOutlineCash size={20} />
              </div>
              <div>
                <p className="text-xs text-emerald-100">Basic Salary</p>
                <p className="font-semibold">40% of CTC</p>
              </div>
            </div>
            <p className="text-sm text-emerald-100">Fixed component of salary structure</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <HiOutlineOfficeBuilding size={20} />
              </div>
              <div>
                <p className="text-xs text-blue-100">HRA</p>
                <p className="font-semibold">40% of Basic</p>
              </div>
            </div>
            <p className="text-sm text-blue-100">House Rent Allowance for accommodation</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <HiOutlineReceiptTax size={20} />
              </div>
              <div>
                <p className="text-xs text-amber-100">PF (Provident Fund)</p>
                <p className="font-semibold">12% of Basic</p>
              </div>
            </div>
            <p className="text-sm text-amber-100">Employee + Employer contribution</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <HiOutlineSparkles size={20} />
              </div>
              <div>
                <p className="text-xs text-purple-100">Special Allowances</p>
                <p className="font-semibold">Flexible</p>
              </div>
            </div>
            <p className="text-sm text-purple-100">Performance & special incentives</p>
          </div>
        </motion.div>
      </div>

      {/* Salary Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Salary Calculator</h2>
              <button onClick={() => setShowCalculator(false)} className="text-slate-400 hover:text-slate-600">
                <HiOutlineX size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Annual CTC</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                  <input
                    type="number"
                    defaultValue="600000"
                    className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Basic Salary (%)</label>
                  <input type="number" defaultValue="40" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">HRA (%)</label>
                  <input type="number" defaultValue="40" className="w-full px-4 py-2 border border-slate-200 rounded-lg" />
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <h3 className="font-semibold text-slate-900 mb-3">Calculated Breakdown</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Monthly CTC</span>
                  <span className="font-medium">₹50,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-medium">₹20,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">HRA</span>
                  <span className="font-medium">₹8,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">DA</span>
                  <span className="font-medium">₹4,000</span>
                </div>
                <div className="flex justify-between text-sm text-red-600">
                  <span>PF Deduction</span>
                  <span>-₹2,400</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-slate-900">
                  <span>Net Take Home</span>
                  <span>₹41,600</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowCalculator(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800">Cancel</button>
              <button onClick={() => setShowCalculator(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Structure</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payslip Preview Modal */}
      {showPayslip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              {/* Payslip Header */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <HiOutlineCurrencyDollar size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">OpsERP</h2>
                    <p className="text-sm text-slate-500">Payslip for {selectedMonth}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Payslip #: PS-2024-001</p>
                  <p className="text-sm text-slate-500">Date: 05 Jan 2024</p>
                </div>
              </div>

              {/* Employee Info */}
              <div className="grid grid-cols-2 gap-6 mb-8 p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Employee Name</p>
                  <p className="font-semibold text-slate-900">{selectedEmployee.name}</p>
                  <p className="text-sm text-slate-600">{selectedEmployee.department}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Employee ID</p>
                  <p className="font-semibold text-slate-900">{selectedEmployee.id}</p>
                  <p className="text-sm text-slate-600">Join Date: 15 Jan 2023</p>
                </div>
              </div>

              {/* Earnings & Deductions */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Earnings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Basic Salary</span>
                      <span className="font-medium">₹{selectedEmployee.basic.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">House Rent Allowance</span>
                      <span className="font-medium">₹{selectedEmployee.hra.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Dearness Allowance</span>
                      <span className="font-medium">₹{selectedEmployee.da.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Special Allowance</span>
                      <span className="font-medium">₹5,000</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-900 pt-2 border-t">
                      <span>Gross Earnings</span>
                      <span>₹{(selectedEmployee.basic + selectedEmployee.hra + selectedEmployee.da + 5000).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Deductions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Provident Fund (PF)</span>
                      <span className="font-medium">₹{selectedEmployee.pf.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">TDS</span>
                      <span className="font-medium">₹{selectedEmployee.tds.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Professional Tax</span>
                      <span className="font-medium">₹200</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Insurance</span>
                      <span className="font-medium">₹500</span>
                    </div>
                    <div className="flex justify-between font-semibold text-red-600 pt-2 border-t">
                      <span>Total Deductions</span>
                      <span>₹{(selectedEmployee.pf + selectedEmployee.tds + 700).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm mb-1">Net Take Home</p>
                    <p className="text-3xl font-bold">₹{selectedEmployee.net.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-100 text-sm">Paid via</p>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-xs text-indigo-200">**** 4532</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t text-center">
                <p className="text-sm text-slate-500">This is a computer generated payslip and does not require signature.</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowPayslip(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800">Close</button>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                <HiOutlineDownload size={18} />
                Download PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
