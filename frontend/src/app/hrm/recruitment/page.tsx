'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HiOutlineBriefcase,
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineUserGroup,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineDownload,
  HiOutlineX,
  HiOutlineChartBar,
} from 'react-icons/hi';

const recruitmentStats = [
  { label: 'Open Positions', value: '12', change: '+3 this month', icon: HiOutlineBriefcase, color: 'blue' },
  { label: 'Total Candidates', value: '156', change: '+24 new', icon: HiOutlineUserGroup, color: 'indigo' },
  { label: 'In Progress', value: '28', change: 'Active pipeline', icon: HiOutlineClock, color: 'amber' },
  { label: 'Avg Time to Hire', value: '18 days', change: '-2 days', icon: HiOutlineCalendar, color: 'green' },
];

const jobOpenings = [
  { id: 'JOB001', title: 'Senior Fleet Manager', department: 'Operations', location: 'Mumbai', type: 'Full-time', salary: '₹8-12 LPA', applicants: 24, status: 'active', posted: '2024-01-10' },
  { id: 'JOB002', title: 'HR Executive', department: 'Human Resources', location: 'Delhi', type: 'Full-time', salary: '₹4-6 LPA', applicants: 18, status: 'active', posted: '2024-01-08' },
  { id: 'JOB003', title: 'React Developer', department: 'IT', location: 'Bangalore', type: 'Full-time', salary: '₹8-15 LPA', applicants: 42, status: 'active', posted: '2024-01-05' },
  { id: 'JOB004', title: 'Accountant', department: 'Finance', location: 'Mumbai', type: 'Full-time', salary: '₹3-5 LPA', applicants: 12, status: 'paused', posted: '2024-01-03' },
  { id: 'JOB005', title: 'Sales Executive', department: 'Sales', location: 'Chennai', type: 'Full-time', salary: '₹3-6 LPA', applicants: 8, status: 'active', posted: '2024-01-12' },
];

const candidates = [
  { id: 'CAN001', name: 'Rahul Sharma', email: 'rahul.s@email.com', phone: '+91 98765 12345', position: 'Senior Fleet Manager', stage: 'interview', rating: 4, experience: '8 years', applied: '2024-01-15', source: 'LinkedIn' },
  { id: 'CAN002', name: 'Priya Gupta', email: 'priya.g@email.com', phone: '+91 98765 12346', position: 'HR Executive', stage: 'screening', rating: 3, experience: '3 years', applied: '2024-01-14', source: 'Referral' },
  { id: 'CAN003', name: 'Amit Patel', email: 'amit.p@email.com', phone: '+91 98765 12347', position: 'React Developer', stage: 'technical', rating: 5, experience: '5 years', applied: '2024-01-13', source: 'Naukri' },
  { id: 'CAN004', name: 'Neha Verma', email: 'neha.v@email.com', phone: '+91 98765 12348', position: 'React Developer', stage: 'new', rating: 0, experience: '2 years', applied: '2024-01-16', source: 'LinkedIn' },
  { id: 'CAN005', name: 'Vikram Rao', email: 'vikram.r@email.com', phone: '+91 98765 12349', position: 'Accountant', stage: 'rejected', rating: 2, experience: '4 years', applied: '2024-01-10', source: 'Indeed' },
];

const pipelineStages = [
  { name: 'New', count: 12, color: 'bg-slate-500' },
  { name: 'Screening', count: 8, color: 'bg-blue-500' },
  { name: 'Interview', count: 6, color: 'bg-indigo-500' },
  { name: 'Technical', count: 4, color: 'bg-purple-500' },
  { name: 'Offer', count: 2, color: 'bg-emerald-500' },
  { name: 'Hired', count: 1, color: 'bg-green-500' },
];

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700 border-green-200',
      paused: 'bg-amber-100 text-amber-700 border-amber-200',
      closed: 'bg-slate-100 text-slate-600 border-slate-200',
      new: 'bg-slate-100 text-slate-600 border-slate-200',
      screening: 'bg-blue-100 text-blue-700 border-blue-200',
      interview: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      technical: 'bg-purple-100 text-purple-700 border-purple-200',
      offer: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      hired: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.new}`}>
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
                <h1 className="text-2xl font-bold text-slate-900">Recruitment & ATS</h1>
                <p className="text-sm text-slate-500">Manage job postings and candidate pipeline</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50">
                <HiOutlineDownload size={18} />
                Export
              </button>
              <button
                onClick={() => setShowJobModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
              >
                <HiOutlinePlus size={18} />
                Post Job
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {recruitmentStats.map((stat, idx) => (
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
                  <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                  stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  'bg-green-50 text-green-600'
                }`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-1 mb-6 inline-flex">
          {['jobs', 'candidates', 'pipeline'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Pipeline View */}
        {activeTab === 'pipeline' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Candidate Pipeline</h2>
            <div className="flex items-center gap-4">
              {pipelineStages.map((stage, idx) => (
                <div key={stage.name} className="flex-1">
                  <div className={`${stage.color} rounded-xl p-4 text-white`}>
                    <p className="text-2xl font-bold">{stage.count}</p>
                    <p className="text-sm opacity-90">{stage.name}</p>
                  </div>
                  {idx < pipelineStages.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center mt-2">
                      <div className="h-0.5 w-full bg-slate-200" />
                      <div className="text-slate-400">→</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Jobs View */}
        {activeTab === 'jobs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Job Openings</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search jobs..."
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
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-3">Position</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Department</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Location</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Salary</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Applicants</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Status</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobOpenings.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{job.title}</p>
                          <p className="text-xs text-slate-500">{job.id} • {job.type}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{job.department}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{job.location}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{job.salary}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-slate-700">
                          <HiOutlineUserGroup size={16} className="text-slate-400" />
                          {job.applicants}
                        </div>
                      </td>
                      <td className="px-4 py-4">{getStatusBadge(job.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                            <HiOutlineEye size={16} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <HiOutlinePencil size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Candidates View */}
        {activeTab === 'candidates' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {candidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => { setSelectedCandidate(candidate); setShowCandidateModal(true); }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{candidate.name}</p>
                      <p className="text-xs text-slate-500">{candidate.position}</p>
                    </div>
                  </div>
                  {getStatusBadge(candidate.stage)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <HiOutlineMail size={14} className="text-slate-400" />
                    {candidate.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <HiOutlinePhone size={14} className="text-slate-400" />
                    {candidate.phone}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <HiOutlineStar className={candidate.rating >= 1 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} size={16} />
                    <HiOutlineStar className={candidate.rating >= 2 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} size={16} />
                    <HiOutlineStar className={candidate.rating >= 3 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} size={16} />
                    <HiOutlineStar className={candidate.rating >= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} size={16} />
                    <HiOutlineStar className={candidate.rating >= 5 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} size={16} />
                  </div>
                  <span className="text-xs text-slate-500">{candidate.experience}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <HiOutlineDocumentText size={20} />
              </div>
              <h3 className="font-semibold">Job Templates</h3>
            </div>
            <p className="text-sm text-blue-100 mb-4">Create reusable job description templates</p>
            <button className="text-sm font-medium flex items-center gap-1">Manage Templates →</button>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <HiOutlineCalendar size={20} />
              </div>
              <h3 className="font-semibold">Interview Schedule</h3>
            </div>
            <p className="text-sm text-emerald-100 mb-4">View and manage upcoming interviews</p>
            <button className="text-sm font-medium flex items-center gap-1">View Schedule →</button>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <HiOutlineChartBar size={20} />
              </div>
              <h3 className="font-semibold">Analytics</h3>
            </div>
            <p className="text-sm text-purple-100 mb-4">Track recruitment metrics and performance</p>
            <button className="text-sm font-medium flex items-center gap-1">View Reports →</button>
          </div>
        </div>
      </div>

      {/* Post Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Post New Job</h2>
              <button onClick={() => setShowJobModal(false)} className="text-slate-400 hover:text-slate-600">
                <HiOutlineX size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
                  <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg" placeholder="e.g. Senior Developer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department *</label>
                  <select className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                    <option>Select department</option>
                    <option>Operations</option>
                    <option>HR</option>
                    <option>IT</option>
                    <option>Finance</option>
                    <option>Sales</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                  <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg" placeholder="e.g. Mumbai" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Type *</label>
                  <select className="w-full px-4 py-2 border border-slate-200 rounded-lg">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range</label>
                <div className="flex items-center gap-2">
                  <input type="text" className="flex-1 px-4 py-2 border border-slate-200 rounded-lg" placeholder="Min (e.g. 500000)" />
                  <span className="text-slate-400">to</span>
                  <input type="text" className="flex-1 px-4 py-2 border border-slate-200 rounded-lg" placeholder="Max (e.g. 800000)" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Description *</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-slate-200 rounded-lg" placeholder="Describe the role, responsibilities, and requirements..." />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowJobModal(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800">Cancel</button>
              <button onClick={() => setShowJobModal(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Post Job</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {showCandidateModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
              <button onClick={() => setShowCandidateModal(false)} className="absolute top-4 right-4 p-2 bg-white/20 rounded-lg text-white hover:bg-white/30">
                <HiOutlineX size={20} />
              </button>
            </div>
            <div className="px-6 pb-6">
              <div className="relative -mt-10 mb-4 flex items-end justify-between">
                <div className="flex items-end gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                    {selectedCandidate.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div className="mb-1">
                    <h2 className="text-2xl font-bold text-slate-900">{selectedCandidate.name}</h2>
                    <p className="text-slate-500">{selectedCandidate.position}</p>
                  </div>
                </div>
                {getStatusBadge(selectedCandidate.stage)}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <HiOutlineMail size={16} className="text-slate-400" />
                      {selectedCandidate.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <HiOutlinePhone size={16} className="text-slate-400" />
                      {selectedCandidate.phone}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Application Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Applied:</span>
                      <span className="text-slate-900">{new Date(selectedCandidate.applied).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Source:</span>
                      <span className="text-slate-900">{selectedCandidate.source}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Experience:</span>
                      <span className="text-slate-900">{selectedCandidate.experience}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Schedule Interview</button>
                <button className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50">Download Resume</button>
                <button className="px-4 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50">Reject</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
