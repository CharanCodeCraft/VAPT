'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, UserPlus, LogOut, Home, Settings 
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/students', icon: Users, label: 'Students' },
    { href: '/admin/students/create', icon: UserPlus, label: 'Add Student' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    window.location.href = '/admin/login';
  };

  return (
    <div className={`bg-white h-screen transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} border-r shadow-sm fixed z-40`}>
      <div className="p-4 border-b">
        <h1 className={`font-bold text-xl ${collapsed ? 'hidden' : ''}`}>
          ERP Admin
        </h1>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-gray-100 mt-2"
        >
          <svg className={`w-5 h-5 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 ${
                isActive ? 'bg-blue-100 border-r-2 border-blue-600 text-blue-600' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className={`${collapsed ? 'hidden' : 'block'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-4 w-full p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className={`${collapsed ? 'hidden' : 'block'}`}>Logout</span>
        </button>
      </div>
    </div>
  );
}
