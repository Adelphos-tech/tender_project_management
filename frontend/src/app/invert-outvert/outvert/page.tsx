'use client';

import { useState, useEffect } from 'react';
import { documentApi } from '@/api/documentApi';
import toast from 'react-hot-toast';
import { 
    HiOutlineSearch, 
    HiOutlineFilter,
    HiOutlineRefresh
} from 'react-icons/hi';
import DocumentCard from '@/components/DocumentCard';

export default function OutvertPage() {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    fileType: '',
    search: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await documentApi.getDocuments(filters);
      setDocuments(data.documents);
    } catch (error: any) {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.type, filters.fileType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleDownload = async (id: string, fileName: string) => {
      try {
        const toastId = toast.loading('Preparing download...');
        const res = await documentApi.downloadDocument(id);
        
        // Use an anchor tag to trigger the download from the Cloudinary URL
        const link = document.createElement('a');
        link.href = res.fileUrl;
        
        // Add fl_attachment flag to Cloudinary URL if it doesn't have it to force download instead of open
        let downloadUrl = res.fileUrl;
        if (downloadUrl.includes('res.cloudinary.com')) {
           const parts = downloadUrl.split('/upload/');
           if (parts.length === 2 && !parts[1].startsWith('fl_attachment')) {
               downloadUrl = `${parts[0]}/upload/fl_attachment/${parts[1]}`;
           }
        }
        
        link.href = downloadUrl;
        link.setAttribute('download', fileName); // The filename to download as
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Download started', { id: toastId });
        
        // Refresh to update download counts
        fetchData();
      } catch (error) {
          toast.error('Download failed');
      }
  };

  const handleDelete = async (id: string) => {
      if (!window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
          return;
      }
      
      try {
          const toastId = toast.loading('Deleting...');
          await documentApi.deleteDocument(id);
          toast.success('Document deleted', { id: toastId });
          fetchData();
      } catch (error: any) {
          toast.error(error?.response?.data?.message || 'Failed to delete');
      }
  };

  return (
    <div className="animate-fadeIn space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
             Outvert (Browse Documents)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
             Search, download, and manage system files
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4 shadow-sm border border-slate-100">
         <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            
            <div className="flex-1 relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by title or filename..." 
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="form-input pl-10 bg-slate-50 border-slate-200"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                    <HiOutlineFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    <select 
                        value={filters.type}
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                        className="form-select pl-9 bg-slate-50 border-slate-200 min-w-[140px]"
                    >
                        <option value="">All Origins</option>
                        <option value="invert">Invert</option>
                        <option value="outvert">Outvert</option>
                    </select>
                </div>

                <div className="relative">
                    <select 
                        value={filters.fileType}
                        onChange={(e) => setFilters({...filters, fileType: e.target.value})}
                        className="form-select bg-slate-50 border-slate-200 min-w-[140px]"
                    >
                        <option value="">All Types</option>
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="image">Image</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <button type="submit" className="btn btn-primary shadow-md shadow-blue-500/20 whitespace-nowrap">
                        Search
                    </button>
                    <button type="button" onClick={() => { setFilters({type: '', fileType: '', search: ''}); setTimeout(() => handleSearch({preventDefault: () => {}} as any), 0); }} className="btn btn-secondary px-3" title="Reset Filters">
                        <HiOutlineRefresh size={18} />
                    </button>
                </div>
            </div>
         </form>
      </div>

      {/* Grid */}
      {loading ? (
          <div className="flex justify-center items-center py-20">
              <div className="spinner" />
          </div>
      ) : documents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {documents.map((doc: any) => (
                  <DocumentCard 
                      key={doc._id} 
                      document={doc} 
                      onDownload={handleDownload} 
                      onDelete={handleDelete} 
                  />
              ))}
          </div>
      ) : (
          <div className="card p-16 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <HiOutlineSearch size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">No documents found</h3>
              <p className="text-slate-500 max-w-sm">
                  Try adjusting your search filters or upload a new file.
              </p>
          </div>
      )}
    </div>
  );
}
