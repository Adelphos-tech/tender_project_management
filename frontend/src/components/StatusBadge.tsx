import { useLanguage } from '@/context/LanguageContext';

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  assigned: 'bg-blue-50 text-blue-700 border-blue-200',
  'in-progress': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  active: 'bg-green-50 text-green-700 border-green-200',
  inactive: 'bg-slate-50 text-slate-600 border-slate-200',
  maintenance: 'bg-orange-50 text-orange-700 border-orange-200',
  available: 'bg-green-50 text-green-700 border-green-200',
  'on-trip': 'bg-blue-50 text-blue-700 border-blue-200',
  'off-duty': 'bg-slate-50 text-slate-600 border-slate-200',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useLanguage();
  const style = statusStyles[status] || 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {t(`status.${status}`)}
    </span>
  );
}
