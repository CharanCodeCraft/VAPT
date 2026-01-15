// app/admin/dashboard/page.js
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [summary, setSummary] = useState({ total: 0, latest: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/students?limit=5&page=1');
        setSummary({
          total: res.data.pagination?.total || res.data.students?.length || 0,
          latest: res.data.students || [],
        });
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">Total students</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {loading ? '…' : summary.total}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-500">IDOR lab ready</p>
          <p className="text-lg mt-1">
            Data seeded by admin is directly consumable by the student portal.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Latest students</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs text-gray-500 uppercase">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>USN</th>
              <th>Dept</th>
              <th>Sem</th>
            </tr>
          </thead>
          <tbody>
            {summary.latest.map((s) => (
              <tr key={s._id} className="border-b last:border-b-0">
                <td className="py-2">{s.name}</td>
                <td>{s.email}</td>
                <td className="font-mono text-xs">{s.usn}</td>
                <td>{s.department}</td>
                <td>{s.semester}</td>
              </tr>
            ))}
            {!loading && summary.latest.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  No students yet. Add one from “Add student”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
