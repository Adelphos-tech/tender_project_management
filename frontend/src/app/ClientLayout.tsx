'use client';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't show spinner on login page; wait until mounted to avoid SSR mismatch
  if ((!mounted || loading) && !isLoginPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner" />
      </div>
    );
  }

  // Wireframe mode: always show sidebar except on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="lg:ml-72 p-4 pt-20 lg:pt-8 lg:p-8 min-w-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

import { SocketProvider } from '@/context/SocketContext';
import { LanguageProvider } from '@/context/LanguageContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>
        <LanguageProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '14px',
              },
            }}
          />
          <LayoutContent>{children}</LayoutContent>
        </LanguageProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
