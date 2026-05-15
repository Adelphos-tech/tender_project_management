'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { documentApi } from '@/api/documentApi';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineCloudUpload } from 'react-icons/hi';
import Link from 'next/link';
import FileUploadZone from '@/components/FileUploadZone';

export default function UploadDocumentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'invert', // default
    tags: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    // Auto-fill title if empty
    if (!formData.title) {
        setFormData(prev => ({ ...prev, title: selectedFile.name.split('.')[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      setLoading(true);
      
      const payload = new FormData();
      payload.append('file', file);
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('type', formData.type);
      
      // Process tags (comma separated)
      if (formData.tags.trim()) {
          const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
          payload.append('tags', JSON.stringify(tagsArray));
      }

      await documentApi.uploadDocument(payload);
      
      toast.success('Document uploaded successfully!');
      router.push('/invert-outvert/outvert');
      
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
            href="/invert-outvert" 
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <HiOutlineArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="page-title text-2xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            Upload Document (Invert)
          </h1>
          <p className="text-sm text-slate-500">Securely store and share files with the team</p>
        </div>
      </div>

      <div className="card shadow-sm border border-slate-100 overflow-hidden relative">
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
              
              {/* File Upload Area */}
              <div>
                  <label className="form-label mb-3">1. Select File <span className="text-red-500">*</span></label>
                  <FileUploadZone 
                     onFileSelect={handleFileSelect}
                     currentFile={file}
                     onClear={() => setFile(null)}
                     maxSizeMB={50}
                  />
              </div>

              {/* Details Area */}
              <div className="space-y-5 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">2. Document Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="col-span-1 md:col-span-2">
                          <label className="form-label">Title <span className="text-red-500">*</span></label>
                          <input
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              className="form-input bg-white shadow-sm"
                              placeholder="e.g., Company Registration 2024"
                              required
                          />
                      </div>

                      <div>
                          <label className="form-label">Type <span className="text-red-500">*</span></label>
                          <select
                              name="type"
                              value={formData.type}
                              onChange={handleInputChange}
                              className="form-select bg-white shadow-sm"
                              required
                          >
                              <option value="invert">Invert (Upload/Store)</option>
                              <option value="outvert">Outvert (Ready for Download)</option>
                          </select>
                          <p className="text-[11px] text-slate-500 mt-1.5 ml-1">Outvert items are primarily meant for wide sharing.</p>
                      </div>

                      <div>
                          <label className="form-label">Tags (Optional)</label>
                          <input
                              type="text"
                              name="tags"
                              value={formData.tags}
                              onChange={handleInputChange}
                              className="form-input bg-white shadow-sm"
                              placeholder="e.g., tax, invoice, legal"
                          />
                          <p className="text-[11px] text-slate-500 mt-1.5 ml-1">Comma-separated for easy searching</p>
                      </div>

                      <div className="col-span-1 md:col-span-2">
                          <label className="form-label">Description (Optional)</label>
                          <textarea
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              className="form-input bg-white shadow-sm min-h-[100px] resize-y"
                              placeholder="Add any relevant notes or context here..."
                          />
                      </div>
                  </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <Link href="/invert-outvert" className="btn btn-secondary px-6">
                      Cancel
                  </Link>
                  <button 
                      type="submit" 
                      className="btn btn-primary px-8 shadow-lg shadow-blue-500/20"
                      disabled={loading || !file}
                  >
                      {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                          <>
                              <HiOutlineCloudUpload size={20} />
                              Upload File
                          </>
                      )}
                  </button>
              </div>
          </form>
      </div>
    </div>
  );
}
