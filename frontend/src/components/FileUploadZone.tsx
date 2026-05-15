'use client';

import React, { useCallback, useState } from 'react';
import { HiOutlineCloudUpload, HiOutlineDocumentText, HiOutlinePhotograph, HiOutlineX } from 'react-icons/hi';
import toast from 'react-hot-toast';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  currentFile?: File | null;
  onClear?: () => void;
}

export default function FileUploadZone({ 
    onFileSelect, 
    accept = '.pdf,.xlsx,.csv,.png,.jpg,.jpeg,.webp',
    maxSizeMB = 50,
    currentFile = null,
    onClear
}: FileUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const processFile = useCallback((file: File) => {
      if (!file) return;

      // Size check
      if (file.size > maxSizeMB * 1024 * 1024) {
          toast.error(`File is too large. Maximum size is ${maxSizeMB}MB.`);
          return;
      }

      onFileSelect(file);
  }, [maxSizeMB, onFileSelect]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
        processFile(files[0]); // Only handle 1 file for now
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
          processFile(files[0]);
      }
  };

  const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (currentFile) {
      const isImage = currentFile.type.startsWith('image/');
      
      return (
          <div className="relative border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4 border-r border-slate-200 pr-4 flex-1 overflow-hidden">
                 <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                     {isImage ? <HiOutlinePhotograph size={24} /> : <HiOutlineDocumentText size={24} />}
                 </div>
                 <div className="min-w-0">
                     <p className="font-semibold text-slate-800 text-sm truncate">{currentFile.name}</p>
                     <p className="text-xs text-slate-500 mt-0.5">{formatFileSize(currentFile.size)}</p>
                 </div>
              </div>
              <button 
                type="button"
                onClick={onClear}
                className="p-2 ml-4 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove file"
              >
                  <HiOutlineX size={20} />
              </button>
          </div>
      );
  }

  return (
    <div 
        className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
            isDragActive 
                ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
                : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/25'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
        <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            onChange={handleChange}
            accept={accept}
        />
        <div className="p-8 text-center flex flex-col items-center pointer-events-none">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'
            }`}>
                <HiOutlineCloudUpload size={32} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">
                Drag and drop your file here
            </h3>
            <p className="text-xs text-slate-500 mb-4">
                or click to browse from your device
            </p>
            <div className="text-[11px] font-medium text-slate-400 max-w-xs mx-auto">
                Supports: PDF, Excel, PNG, JPG (Max: {maxSizeMB}MB)
            </div>
        </div>
    </div>
  );
}
