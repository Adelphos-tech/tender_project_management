'use client';

import React from 'react';
import { format } from 'date-fns';
import { 
    HiOutlineDocumentText, 
    HiOutlinePhotograph, 
    HiOutlineDownload, 
    HiOutlineTrash,
    HiOutlineDocumentReport
} from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';

interface DocumentCardProps {
  document: any;
  onDownload: (id: string, name: string) => void;
  onDelete?: (id: string) => void;
}

export default function DocumentCard({ document, onDownload, onDelete }: DocumentCardProps) {
  const { user } = useAuth();
  
  const getIcon = () => {
    switch (document.fileType) {
      case 'pdf':
        return <HiOutlineDocumentText size={32} className="text-red-500" />;
      case 'excel':
        return <HiOutlineDocumentReport size={32} className="text-green-500" />;
      case 'image':
        return <HiOutlinePhotograph size={32} className="text-blue-500" />;
      default:
        return <HiOutlineDocumentText size={32} className="text-slate-500" />;
    }
  };

  const getBadgeColor = () => {
    return document.type === 'invert' 
      ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
      : 'bg-indigo-100 text-indigo-700 border-indigo-200';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const canDelete = user?.role === 'admin' || (user && document.uploadedBy && document.uploadedBy._id === (user as any).id || user && document.uploadedBy && document.uploadedBy._id === (user as any)._id);

  return (
    <div className="card overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
             {getIcon()}
          </div>
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getBadgeColor()} shadow-sm`}>
             {document.type}
          </div>
        </div>

        <h3 className="font-bold text-slate-800 text-sm mb-1 truncate" title={document.title}>
            {document.title}
        </h3>
        
        {document.description ? (
            <p className="text-xs text-slate-500 line-clamp-2 mb-3 h-8" title={document.description}>
                {document.description}
            </p>
        ) : (
            <div className="h-8 mb-3" /> // Spacer
        )}

        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar min-h-[24px]">
            {document.tags && document.tags.map((tag: string, index: number) => (
                <span key={index} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium whitespace-nowrap shrink-0 border border-slate-200">
                    {tag}
                </span>
            ))}
        </div>

        <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="flex justify-between">
                <span>Size:</span>
                <span className="font-medium text-slate-700">{formatFileSize(document.fileSize)}</span>
            </div>
            <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium text-slate-700">
                    {format(new Date(document.createdAt), 'dd MMM, yy')}
                </span>
            </div>
            <div className="flex justify-between">
                <span>By:</span>
                <span className="font-medium text-slate-700 truncate max-w-[100px]" title={document.uploadedBy?.name}>
                    {document.uploadedBy?.name || 'Unknown'}
                </span>
            </div>
        </div>
      </div>

      <div className="bg-slate-50 border-t border-slate-100 p-3 flex justify-between items-center px-4">
        <span className="text-[10px] font-medium text-slate-500">
            {document.downloadCount || 0} downloads
        </span>
        <div className="flex gap-2">
            <button 
                onClick={() => onDownload(document._id, document.fileName)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-blue-600 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm"
                title="Download"
            >
                <HiOutlineDownload size={16} />
            </button>
            {canDelete && onDelete && (
                <button 
                    onClick={() => onDelete(document._id)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-red-500 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                    title="Delete"
                >
                    <HiOutlineTrash size={16} />
                </button>
            )}
        </div>
      </div>
    </div>
  );
}
