import React from 'react';

interface Props {
  status: 'pending' | 'paid' | 'overdue' | string;
}

export default function InstallmentStatusBadge({ status }: Props) {
  let colorClass = '';

  switch (status.toLowerCase()) {
    case 'paid':
      colorClass = 'bg-emerald-50 text-emerald-600 border-emerald-200';
      break;
    case 'overdue':
      colorClass = 'bg-red-50 text-red-600 border-red-200';
      break;
    case 'pending':
    default:
      colorClass = 'bg-amber-50 text-amber-600 border-amber-200';
      status = 'pending';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${colorClass}`}>
      {status}
    </span>
  );
}
