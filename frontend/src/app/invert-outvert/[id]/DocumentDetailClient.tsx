'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {
  HiOutlineArrowLeft,
  HiOutlineDownload,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlineDocumentReport,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineTag
} from 'react-icons/hi';

interface DocumentDetailClientProps {
  id: string;
}

export default function DocumentDetailClient({ id }: DocumentDetailClientProps) {
  const router = useRouter();
  const { hasPermission } = useAuth();

  const [document] = useState({
    _id: id,
    name: 'Sample Document.pdf',
    type: 'pdf',
    size: 2048576,
    uploadedAt: '2024-01-10',
    uploadedBy: { name: 'Admin User' },
    fileUrl: '#',
  });

  const handleDownload = () => {
    toast.success('Download started');
  };

  const handleDelete = () => {
    if (!hasPermission('documents', 'delete')) {
      toast.error('No permission to delete');
      return;
    }
    toast.success('Document deleted');
    router.push('/invert-outvert/outvert');
  };

  const getDocumentIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'image':
        return <HiOutlinePhotograph className="w-16 h-16 text-blue-500" />;
      case 'pdf':
        return <HiOutlineDocumentText className="w-16 h-16 text-red-500" />;
      case 'report':
        return <HiOutlineDocumentReport className="w-16 h-16 text-green-500" />;
      default:
        return <HiOutlineDocumentText className="w-16 h-16 text-gray-500" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'image':
        return 'Image';
      case 'pdf':
        return 'PDF Document';
      case 'report':
        return 'Report';
      default:
        return 'Document';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/invert-outvert/outvert"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <HiOutlineArrowLeft className="w-5 h-5 mr-2" />
            Back to Documents
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{document.name}</h1>
            <div className="flex space-x-3">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <HiOutlineDownload className="w-5 h-5 mr-2" />
                Download
              </button>
              {hasPermission('documents', 'delete') && (
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <HiOutlineTrash className="w-5 h-5 mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              {getDocumentIcon(document.type)}
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <HiOutlineTag className="w-4 h-4 mr-2" />
                  Type
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{getDocumentTypeLabel(document.type)}</dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <HiOutlineUser className="w-4 h-4 mr-2" />
                  Uploaded By
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{document.uploadedBy?.name}</dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <HiOutlineClock className="w-4 h-4 mr-2" />
                  Upload Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {document.uploadedAt ? format(new Date(document.uploadedAt), 'MMM dd, yyyy') : 'N/A'}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Size</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {document.size ? `${(document.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
