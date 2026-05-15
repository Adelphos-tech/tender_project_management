'use client';

import { useAuth } from '@/context/AuthContext';

export default function DebugSidebar() {
  const { user, loading, permissions } = useAuth();

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, background: 'red', color: 'white', padding: '10px', zIndex: 9999 }}>
      <p>User: {user ? user.name : 'null'}</p>
      <p>Loading: {loading ? 'true' : 'false'}</p>
      <p>Permissions: {permissions.length}</p>
    </div>
  );
}
