// app/admin/layout.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('admin');
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    if (adminData) setAdmin(JSON.parse(adminData));
  }, [router, pathname]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    router.replace('/admin/login');
  };

  // Keep login page plain
  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-blue-700">ERP Admin</span>
            <nav className="flex gap-4 text-sm text-gray-600">
              <button onClick={() => router.push('/admin/dashboard')} className="hover:text-blue-600">
                Dashboard
              </button>
              <button onClick={() => router.push('/admin/students')} className="hover:text-blue-600">
                Students
              </button>
              <button onClick={() => router.push('/admin/students/add')} className="hover:text-blue-600">
                Add student
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {admin?.fullName || admin?.username || 'Admin'}
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">{children}</main>
    </div>
  );
}
