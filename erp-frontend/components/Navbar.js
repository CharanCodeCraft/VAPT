'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const studentData = localStorage.getItem('student');
    if (studentData) {
      setStudent(JSON.parse(studentData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    router.push('/login');
  };

  const viewMyProfile = () => {
    if (student) {
      router.push(`/profile/${student.id}?requestorid=${student.id}`);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold cursor-pointer" onClick={() => router.push('/dashboard')}>
              ERP Portal
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/search')}
              className="px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Search Students
            </button>
            {student && (
              <>
                <button
                  onClick={viewMyProfile}
                  className="px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  My Profile
                </button>
                <span className="text-sm">{student.name}</span>
              </>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
