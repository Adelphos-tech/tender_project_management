'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { contractorBillApi } from '@/api/contractorBillApi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineCheck } from 'react-icons/hi';

export default function NewContractorBill() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    projectName: '',
    contractorName: '',
    contractorContact: '',
    description: '',
    totalContractValue: '',
    
    // On-paper
    paperBillNo: '',
    paperBillDate: new Date().toISOString().split('T')[0],
    paperBillAmount: '',
    paymentRequested: '',
    
    // On-site
    onSiteCompletionPct: 0,
    onSiteMeasuredBy: '',
    onSiteMeasurementDate: new Date().toISOString().split('T')[0],
    varianceNote: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'onSiteCompletionPct' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.projectName || !formData.contractorName || !formData.totalContractValue) {
          return toast.error('Please fill required project details');
      }

      if (!formData.paperBillAmount || !formData.paymentRequested) {
          return toast.error('Please fill paper bill and payment requested amounts');
      }

      try {
          setLoading(true);
          const payload = {
              ...formData,
              totalContractValue: Number(formData.totalContractValue),
              paperBillAmount: Number(formData.paperBillAmount),
              paymentRequested: Number(formData.paymentRequested),
          };

          const res = await contractorBillApi.create(payload);
          toast.success('Contractor Bill created successfully!');
          router.push(`/project-master/contractor-bill/${res.bill._id}`);
      } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to create bill');
      } finally {
          setLoading(false);
      }
  };

  // Live preview calcs
  const tcv = Number(formData.totalContractValue) || 0;
  const pba = Number(formData.paperBillAmount) || 0;
  const pr = Number(formData.paymentRequested) || 0;
  
  const paperPct = tcv > 0 ? (pba / tcv) * 100 : 0;
  const variance = Math.abs(formData.onSiteCompletionPct - paperPct);

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
            href="/project-master/contractor-bill" 
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <HiOutlineArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title text-2xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            Create Contractor Bill
          </h1>
          <p className="text-sm text-slate-500">Record on-paper bills against on-site progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form className="lg:col-span-2 space-y-6" onSubmit={handleSubmit}>
              
              {/* Step 1: Project Details */}
              <div className="card p-6 shadow-sm border border-slate-100">
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 pb-3 border-b border-slate-100">
                    Step 1: Project & Contract Basics
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div>
                         <label className="form-label">Project Name <span className="text-red-500">*</span></label>
                         <input type="text" name="projectName" required value={formData.projectName} onChange={handleInputChange} className="form-input bg-slate-50" placeholder="e.g. Phase 2 Building" />
                     </div>
                     <div>
                         <label className="form-label">Contractor Name <span className="text-red-500">*</span></label>
                         <input type="text" name="contractorName" required value={formData.contractorName} onChange={handleInputChange} className="form-input bg-slate-50" placeholder="e.g. ABC Constructions" />
                     </div>
                     <div>
                         <label className="form-label">Total Contract Value (₹) <span className="text-red-500">*</span></label>
                         <input type="number" min="1" name="totalContractValue" required value={formData.totalContractValue} onChange={handleInputChange} className="form-input bg-slate-50 font-bold text-slate-800" placeholder="e.g. 10000000" />
                     </div>
                     <div>
                         <label className="form-label">Contractor Contact</label>
                         <input type="text" name="contractorContact" value={formData.contractorContact} onChange={handleInputChange} className="form-input bg-slate-50" placeholder="Phone or email" />
                     </div>
                 </div>
              </div>

              {/* Step 2: On-Paper */}
              <div className="card p-6 shadow-sm border border-blue-100 bg-blue-50/10">
                 <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-5 pb-3 border-b border-blue-100 flex items-center gap-2">
                    📄 Step 2: On-Paper Bill Details
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div>
                         <label className="form-label">Paper Bill No.</label>
                         <input type="text" name="paperBillNo" value={formData.paperBillNo} onChange={handleInputChange} className="form-input" placeholder="e.g. INV-2024-01" />
                     </div>
                     <div>
                         <label className="form-label">Bill Date <span className="text-red-500">*</span></label>
                         <input type="date" name="paperBillDate" required value={formData.paperBillDate} onChange={handleInputChange} className="form-input" />
                     </div>
                     <div>
                         <label className="form-label text-blue-800">Paper Bill Amount (₹) <span className="text-red-500">*</span></label>
                         <input type="number" min="0" name="paperBillAmount" required value={formData.paperBillAmount} onChange={handleInputChange} className="form-input border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm" placeholder="Amount claimed on paper" />
                         <p className="text-[10px] text-slate-500 mt-1">What the contractor billed you this cycle.</p>
                     </div>
                     <div>
                         <label className="form-label text-emerald-700">Payment Requested (₹) <span className="text-red-500">*</span></label>
                         <input type="number" min="0" name="paymentRequested" required value={formData.paymentRequested} onChange={handleInputChange} className="form-input border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500/20 shadow-sm font-bold text-emerald-700" placeholder="Amount they want now" />
                         <p className="text-[10px] text-slate-500 mt-1">How much they are asking to be paid immediately.</p>
                     </div>
                 </div>
              </div>

              {/* Step 3: On-Site */}
              <div className="card p-6 shadow-sm border border-indigo-100 bg-indigo-50/10">
                 <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-5 pb-3 border-b border-indigo-100 flex items-center gap-2">
                    🏗️ Step 3: On-Site Actual Progress
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div className="md:col-span-2">
                         <label className="form-label flex justify-between">
                            <span>Physical Completion Percentage</span>
                            <span className="font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">{formData.onSiteCompletionPct}%</span>
                         </label>
                         <input 
                            type="range" 
                            min="0" max="100" 
                            name="onSiteCompletionPct" 
                            value={formData.onSiteCompletionPct} 
                            onChange={handleInputChange} 
                            className="w-full mt-2 accent-indigo-600" 
                         />
                         <p className="text-[10px] text-slate-500 mt-2">The actual physical work done on the ground measured by your team.</p>
                     </div>
                     <div>
                         <label className="form-label">Measured By</label>
                         <input type="text" name="onSiteMeasuredBy" value={formData.onSiteMeasuredBy} onChange={handleInputChange} className="form-input" placeholder="Engineer/Supervisor name" />
                     </div>
                     <div>
                         <label className="form-label">Measurement Date</label>
                         <input type="date" name="onSiteMeasurementDate" value={formData.onSiteMeasurementDate} onChange={handleInputChange} className="form-input" />
                     </div>
                     <div className="md:col-span-2">
                         <label className="form-label">Variance Explanation Note</label>
                         <textarea name="varianceNote" value={formData.varianceNote} onChange={handleInputChange} className="form-input" rows={2} placeholder="Explain any gap between billed amount and physical work done..." />
                     </div>
                 </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <Link href="/project-master/contractor-bill" className="btn btn-secondary px-6">Cancel</Link>
                  <button type="submit" disabled={loading} className="btn btn-primary px-8 shadow-lg shadow-blue-500/20">
                      {loading ? <div className="spinner w-5 h-5 border-2" /> : <><HiOutlineCheck size={20} /> Create Bill Record</>}
                  </button>
              </div>
          </form>

          {/* Live Preview Sidebar */}
          <div className="lg:col-span-1">
              <div className="card p-6 shadow-sm border border-slate-200 sticky top-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Live Summary Preview</h3>
                  
                  <div className="space-y-6">
                      <div className="text-center pb-4 border-b border-slate-100">
                          <p className="text-xs text-slate-500 mb-1">Total Contract Value</p>
                          <p className="text-xl font-black text-slate-800">
                              ₹{tcv.toLocaleString('en-IN')}
                          </p>
                      </div>

                      <div>
                          <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><span className="text-blue-500">📄</span> On-Paper Billed</span>
                              <span className="text-sm font-bold text-slate-600">{Math.round(paperPct)}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(paperPct, 100)}%` }}></div>
                          </div>
                          <p className="text-xs font-medium text-slate-500">₹{pba.toLocaleString('en-IN')} claimed on paper</p>
                          
                          {pr > 0 && (
                              <div className="mt-3 p-2 bg-emerald-50 border border-emerald-100 rounded-lg flex justify-between items-center">
                                  <span className="text-xs font-bold text-emerald-800">Payment Ask:</span>
                                  <span className="text-sm font-black text-emerald-600">₹{pr.toLocaleString('en-IN')}</span>
                              </div>
                          )}
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                          <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><span className="text-indigo-500">🏗️</span> On-Site Physical</span>
                              <span className="text-sm font-bold text-slate-600">{formData.onSiteCompletionPct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${formData.onSiteCompletionPct}%` }}></div>
                          </div>
                          <p className="text-xs font-medium text-slate-500">Actual site progress</p>
                      </div>

                      <div className={`mt-6 p-4 rounded-xl border flex flex-col items-center justify-center text-center ${
                          variance > 15 ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'
                      }`}>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Variance Gap</p>
                          <p className={`text-2xl font-black ${variance > 15 ? 'text-red-500' : 'text-slate-700'}`}>
                              {Math.round(variance)}%
                          </p>
                          {variance > 15 && <p className="text-xs text-red-600 font-medium mt-1">Significant gap detected</p>}
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
