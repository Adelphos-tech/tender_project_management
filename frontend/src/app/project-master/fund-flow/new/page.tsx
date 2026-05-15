'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fundFlowApi } from '@/api/fundFlowApi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineCheck, HiOutlineCalculator, HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';
import { addMonths } from 'date-fns';

export default function NewFundFlowProject() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [projectData, setProjectData] = useState({
    projectName: '',
    clientName: '',
    description: '',
    totalAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const [paymentMode, setPaymentMode] = useState<'automatic' | 'manual'>('automatic');
  const [autoInstallmentCount, setAutoInstallmentCount] = useState<number>(1);
  const [autoFrequency, setAutoFrequency] = useState<'monthly'>('monthly');

  const [manualInstallments, setManualInstallments] = useState<any[]>([
      { amount: '', dueDate: new Date().toISOString().split('T')[0] }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleManualInstallmentChange = (index: number, field: string, value: string) => {
    const updated = [...manualInstallments];
    updated[index][field] = value;
    setManualInstallments(updated);
  };

  const addManualInstallment = () => {
      setManualInstallments([...manualInstallments, { amount: '', dueDate: '' }]);
  };

  const removeManualInstallment = (index: number) => {
      if (manualInstallments.length === 1) return;
      const updated = manualInstallments.filter((_, i) => i !== index);
      setManualInstallments(updated);
  };

  // Generate Automatic Plan
  const getAutoPlan = () => {
      if (!projectData.totalAmount || autoInstallmentCount < 1) return [];
      
      const total = Number(projectData.totalAmount);
      const count = autoInstallmentCount;
      const baseAmount = Math.floor(total / count);
      const remainder = total % count;
      const start = new Date(projectData.startDate);

      const plan = [];
      for (let i = 0; i < count; i++) {
          const amount = i === count - 1 ? baseAmount + remainder : baseAmount;
          let dueDate = new Date(start);
          
          if (autoFrequency === 'monthly') {
              dueDate = addMonths(start, i);
          }

          plan.push({
              installmentNo: i + 1,
              amount: amount,
              dueDate: dueDate.toISOString().split('T')[0]
          });
      }
      return plan;
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const total = Number(projectData.totalAmount);
      if (total <= 0) {
          return toast.error('Total amount must be greater than 0');
      }

      let installmentsData = [];

      if (paymentMode === 'automatic') {
          installmentsData = getAutoPlan();
      } else {
          // Validate manual mode
          let sum = 0;
          for (const inst of manualInstallments) {
              const amt = Number(inst.amount);
              if (!amt || amt <= 0) return toast.error('All installments must have a valid amount');
              if (!inst.dueDate) return toast.error('All installments must have a due date');
              sum += amt;
          }
          if (sum !== total) {
              return toast.error(`Installment sum (${sum}) does not match Total Amount (${total})`);
          }
          installmentsData = manualInstallments;
      }

      try {
          setLoading(true);
          const payload = {
              ...projectData,
              totalAmount: total,
              paymentMode,
              installmentsData
          };

          const res = await fundFlowApi.createProject(payload);
          toast.success('Project created successfully!');
          router.push(`/project-master/fund-flow/${res.project._id}`);
      } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to create project');
      } finally {
          setLoading(false);
      }
  };

  const autoPlanPreview = getAutoPlan();

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
            href="/project-master/fund-flow" 
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <HiOutlineArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title text-2xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            Create Project Phase
          </h1>
          <p className="text-sm text-slate-500">Define project details and payment schedules</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Step 1: Core Details */}
          <div className="card p-6 shadow-sm border border-slate-100">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 pb-3 border-b border-slate-100">
                1. Main Details
             </h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                     <label className="form-label">Project Name <span className="text-red-500">*</span></label>
                     <input type="text" name="projectName" required value={projectData.projectName} onChange={handleInputChange} className="form-input bg-slate-50" placeholder="e.g. City Mall Renovation" />
                 </div>
                 <div>
                     <label className="form-label">Client Name <span className="text-red-500">*</span></label>
                     <input type="text" name="clientName" required value={projectData.clientName} onChange={handleInputChange} className="form-input bg-slate-50" placeholder="e.g. Acme Corp" />
                 </div>
                 <div>
                     <label className="form-label">Total Amount (₹) <span className="text-red-500">*</span></label>
                     <input type="number" name="totalAmount" required min="1" value={projectData.totalAmount} onChange={handleInputChange} className="form-input bg-slate-50 font-bold text-emerald-600" placeholder="50000" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                         <label className="form-label">Start Date <span className="text-red-500">*</span></label>
                         <input type="date" name="startDate" required value={projectData.startDate} onChange={handleInputChange} className="form-input bg-slate-50" />
                     </div>
                     <div>
                         <label className="form-label">End Date (Target)</label>
                         <input type="date" name="endDate" value={projectData.endDate} onChange={handleInputChange} className="form-input bg-slate-50" />
                     </div>
                 </div>
                 <div className="md:col-span-2">
                     <label className="form-label">Description (Optional)</label>
                     <textarea name="description" value={projectData.description} onChange={handleInputChange} className="form-input bg-slate-50" rows={2} />
                 </div>
             </div>
          </div>

          {/* Step 2: Payment Plan */}
          <div className="card p-6 shadow-sm border border-slate-100">
             <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 pb-3 border-b border-slate-100">
                2. Fund Flow Schedule
             </h3>

             {/* Mode Toggle */}
             <div className="flex bg-slate-100 p-1 rounded-xl mb-8 max-w-sm mx-auto">
                 <button 
                    type="button"
                    onClick={() => setPaymentMode('automatic')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${paymentMode === 'automatic' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                     <HiOutlineCalculator size={18} />
                     Automatic Split
                 </button>
                 <button 
                    type="button"
                    onClick={() => setPaymentMode('manual')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${paymentMode === 'manual' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                     <HiOutlinePencilAlt size={18} />
                     Manual Split
                 </button>
             </div>

             {/* Automatic Settings */}
             {paymentMode === 'automatic' && (
                 <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                         <div>
                             <label className="form-label text-blue-800">Number of Installments / Phases <span className="text-red-500">*</span></label>
                             <input type="number" min="1" max="60" required value={autoInstallmentCount} onChange={(e) => setAutoInstallmentCount(Number(e.target.value))} className="form-input bg-white" />
                         </div>
                         <div>
                             <label className="form-label text-blue-800">Frequency</label>
                             <select className="form-select bg-white" value={autoFrequency} onChange={(e) => setAutoFrequency(e.target.value as any)}>
                                 <option value="monthly">Monthly</option>
                             </select>
                         </div>
                     </div>

                     {/* Preview */}
                     {projectData.totalAmount && autoInstallmentCount > 0 && (
                         <div className="border border-slate-200 rounded-xl overflow-hidden">
                             <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                 Generated Schedule Preview
                             </div>
                             <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                                 {autoPlanPreview.map((inst, i) => (
                                     <div key={i} className="flex justify-between items-center px-4 py-3 text-sm">
                                         <span className="font-medium text-slate-700">Phase {inst.installmentNo}</span>
                                         <span className="text-slate-500">{inst.dueDate}</span>
                                         <span className="font-bold text-emerald-600">₹{inst.amount}</span>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     )}
                 </div>
             )}

             {/* Manual Settings */}
             {paymentMode === 'manual' && (
                 <div className="space-y-4">
                     <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 mb-6 flex justify-between items-center text-sm">
                         <span className="text-amber-800">Total Project Amount: <strong>₹{projectData.totalAmount || 0}</strong></span>
                         <span className="text-amber-800 font-bold">
                             Allocated: ₹{manualInstallments.reduce((sum, inst) => sum + (Number(inst.amount) || 0), 0)}
                         </span>
                     </div>

                     {manualInstallments.map((inst, index) => (
                         <div key={index} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                             <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                                 {index + 1}
                             </div>
                             <div className="flex-1">
                                 <label className="text-[10px] font-bold text-slate-500 uppercase">Amount (₹)</label>
                                 <input type="number" min="0" required value={inst.amount} onChange={(e) => handleManualInstallmentChange(index, 'amount', e.target.value)} className="form-input bg-white h-9 py-1 text-sm font-semibold" placeholder="Amount" />
                             </div>
                             <div className="flex-1">
                                 <label className="text-[10px] font-bold text-slate-500 uppercase">Due Date</label>
                                 <input type="date" required value={inst.dueDate} onChange={(e) => handleManualInstallmentChange(index, 'dueDate', e.target.value)} className="form-input bg-white h-9 py-1 text-sm" />
                             </div>
                             {manualInstallments.length > 1 && (
                                 <button type="button" onClick={() => removeManualInstallment(index)} className="mt-4 p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0">
                                     <HiOutlineTrash size={18} />
                                 </button>
                             )}
                         </div>
                     ))}

                     <button type="button" onClick={addManualInstallment} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-bold text-slate-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                         + Add Payment Phase
                     </button>
                 </div>
             )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
              <Link href="/project-master/fund-flow" className="btn btn-secondary px-6">Cancel</Link>
              <button type="submit" disabled={loading} className="btn btn-primary px-8 shadow-lg shadow-blue-500/20">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><HiOutlineCheck size={20} /> Create Project</>}
              </button>
          </div>
      </form>
    </div>
  );
}
