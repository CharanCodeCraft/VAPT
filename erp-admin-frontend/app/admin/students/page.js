// app/admin/students/page.js
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (page = 1, term = search) => {
    setLoading(true);
    try {
      const res = await api.get('/admin/students', {
        params: { page, limit: 10, search: term },
      });
      setStudents(res.data.students);
      setPagination(res.data.pagination);
    } catch (e) {
      console.error(e);
      alert('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, '');
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    load(1, search);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <button
          onClick={() => router.push('/admin/students/add')}
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          + Add student
        </button>
      </div>

      <form onSubmit={onSearch} className="mb-4 flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, USN, email…"
          className="flex-1 px-3 py-2 rounded-md border border-gray-300 text-sm"
        />
        <button
          type="submit"
          className="px-3 py-2 rounded-md bg-gray-800 text-white text-sm hover:bg-gray-900"
        >
          Search
        </button>
      </form>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-gray-500 uppercase">
              <th className="py-2 px-3">Name</th>
              <th className="px-3">USN</th>
              <th className="px-3">Email</th>
              <th className="px-3">Phone</th>
              <th className="px-3">Dept</th>
              <th className="px-3">Sem</th>
              <th className="px-3">Fee pending</th>
              <th className="px-3">Records</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr key={s._id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-2 px-3">{s.name}</td>
                  <td className="px-3 font-mono text-xs">{s.usn}</td>
                  <td className="px-3">{s.email}</td>
                  <td className="px-3">{s.phone}</td>
                  <td className="px-3">{s.department}</td>
                  <td className="px-3">{s.semester}</td>
                  <td className="px-3">
                    ₹{s.feeDetails?.pendingAmount ?? 0}
                  </td>
                  <td className="px-3">
                    {(s.academicRecords && s.academicRecords.length) || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 mt-3 text-sm">
        <span className="text-gray-500">
          Page {pagination.current} of {pagination.pages} • {pagination.total} students
        </span>
        <button
          disabled={pagination.current <= 1}
          onClick={() => load(pagination.current - 1)}
          className="px-2 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>
        <button
          disabled={pagination.current >= pagination.pages}
          onClick={() => load(pagination.current + 1)}
          className="px-2 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
