'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Expense } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';
import { HiOutlineTrash } from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

export default function ExpensesPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  const canDelete = user?.role === 'admin' || user?.role === 'manager';

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses', { params: { type: typeFilter || undefined } });
      setExpenses(res.data);
    } catch { toast.error(t('expenses.toast.loadFailed')); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchExpenses(); }, [typeFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm(t('expenses.confirmDelete'))) return;
    try {
      await api.delete(`/expenses/${id}`);
      toast.success(t('expenses.toast.deleted'));
      fetchExpenses();
    } catch { toast.error(t('expenses.toast.deleteFailed')); }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('expenses.title')}</h1>
          <p className="text-sm text-slate-500 mt-1">{t('expenses.total')}: ₹{totalAmount.toLocaleString()}</p>
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="form-select w-auto">
          <option value="">{t('expenses.allTypes')}</option>
          <option value="fuel">{t('expenses.types.fuel')}</option>
          <option value="toll">{t('expenses.types.toll')}</option>
          <option value="parking">{t('expenses.types.parking')}</option>
          <option value="food">{t('expenses.types.food')}</option>
          <option value="maintenance">{t('expenses.types.maintenance')}</option>
          <option value="other">{t('expenses.types.other')}</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-12"><div className="spinner" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>{t('expenses.table.type')}</th><th>{t('expenses.table.amount')}</th><th>{t('expenses.table.description')}</th><th>{t('expenses.table.date')}</th><th>{t('expenses.table.addedBy')}</th>{canDelete && <th>{t('expenses.table.actions')}</th>}</tr></thead>
              <tbody>
                {expenses.length > 0 ? expenses.map((exp) => (
                  <tr key={exp._id}>
                    <td>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize bg-slate-100 text-slate-700">
                        {exp.type}
                      </span>
                    </td>
                    <td className="font-semibold">₹{exp.amount.toLocaleString()}</td>
                    <td>{exp.description || '-'}</td>
                    <td>{format(new Date(exp.date), 'dd MMM yyyy')}</td>
                    <td>{exp.addedBy?.name || 'N/A'}</td>
                    {canDelete && (
                      <td>
                        <button onClick={() => handleDelete(exp._id)} className="btn btn-danger btn-sm"><HiOutlineTrash size={14} /></button>
                      </td>
                    )}
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="text-center py-8 text-slate-400">{t('expenses.noData')}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
