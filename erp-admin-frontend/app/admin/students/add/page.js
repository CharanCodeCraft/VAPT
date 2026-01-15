// app/admin/students/add/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AddStudent() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    usn: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    semester: '',
    profileImage: '',
    address: '',
    dateOfBirth: '',
    parentContact: '',
    academicRecords: [{ subject: '', marks: '', semester: '' }],
    feeDetails: { totalFees: '', paidAmount: '', pendingAmount: '' },
  });
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState('');

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const setFee = (field, value) =>
    setForm((f) => ({ ...f, feeDetails: { ...f.feeDetails, [field]: value } }));

  const updateRecord = (idx, field, value) =>
    setForm((f) => ({
      ...f,
      academicRecords: f.academicRecords.map((r, i) =>
        i === idx ? { ...r, [field]: value } : r
      ),
    }));

  const addRecord = () =>
    setForm((f) => ({
      ...f,
      academicRecords: [...f.academicRecords, { subject: '', marks: '', semester: '' }],
    }));

  const removeRecord = (idx) =>
    setForm((f) => ({
      ...f,
      academicRecords: f.academicRecords.filter((_, i) => i !== idx),
    }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setInfo('');

    const payload = {
      ...form,
      semester: form.semester ? Number(form.semester) : undefined,
      academicRecords: form.academicRecords
        .filter((r) => r.subject && r.marks)
        .map((r) => ({
          subject: r.subject,
          marks: Number(r.marks),
          semester: r.semester ? Number(r.semester) : undefined,
        })),
      feeDetails: {
        totalFees: form.feeDetails.totalFees ? Number(form.feeDetails.totalFees) : 0,
        paidAmount: form.feeDetails.paidAmount ? Number(form.feeDetails.paidAmount) : 0,
        pendingAmount: form.feeDetails.pendingAmount ? Number(form.feeDetails.pendingAmount) : 0,
      },
    };

    try {
      // match your POST /api/admin/students route
      const res = await api.post('/admin/students', payload);
      setInfo(
        `Student created.\nEmail: ${res.data.loginCredentials?.email || payload.email}\nPassword: ${
          res.data.loginCredentials?.password || payload.password
        }`
      );
      // Optionally, reset form
    } catch (err) {
      setInfo(err?.response?.data?.message || 'Failed to create student');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Add student</h1>
        <button
          onClick={() => router.push('/admin/students')}
          className="px-3 py-1 rounded border text-sm"
        >
          Back
        </button>
      </div>

      {info && (
        <pre className="mb-4 whitespace-pre-wrap text-sm p-3 rounded bg-slate-900 text-slate-100">
          {info}
        </pre>
      )}

      <form onSubmit={submit} className="space-y-6">
        {/* Basic info */}
        <div className="grid md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow">
          <div>
            <label className="text-xs font-semibold text-gray-600">Name *</label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">USN *</label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              value={form.usn}
              onChange={(e) => setField('usn', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Email *</label>
            <input
              type="email"
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">
              Login password *(for student)
            </label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Phone *</label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Department</label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              value={form.department}
              onChange={(e) => setField('department', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Semester</label>
            <select
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              value={form.semester}
              onChange={(e) => setField('semester', e.target.value)}
            >
              <option value="">Select</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Profile image URL</label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              value={form.profileImage}
              onChange={(e) => setField('profileImage', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Date of birth</label>
            <input
              type="date"
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              value={form.dateOfBirth}
              onChange={(e) => setField('dateOfBirth', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Parent contact</label>
            <input
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              value={form.parentContact}
              onChange={(e) => setField('parentContact', e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-semibold text-gray-600">Address</label>
            <textarea
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              rows={2}
              value={form.address}
              onChange={(e) => setField('address', e.target.value)}
            />
          </div>
        </div>

        {/* Academic records */}
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">Academic records</h2>
            <button
              type="button"
              onClick={addRecord}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-50"
            >
              + Add record
            </button>
          </div>
          {form.academicRecords.map((r, idx) => (
            <div
              key={idx}
              className="grid md:grid-cols-4 gap-3 items-end bg-gray-50 p-3 rounded-lg"
            >
              <div>
                <label className="text-xs text-gray-600">Subject</label>
                <input
                  className="w-full mt-1 px-3 py-2 border rounded text-sm"
                  value={r.subject}
                  onChange={(e) => updateRecord(idx, 'subject', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Marks</label>
                <input
                  type="number"
                  className="w-full mt-1 px-3 py-2 border rounded text-sm"
                  value={r.marks}
                  onChange={(e) => updateRecord(idx, 'marks', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Semester</label>
                <select
                  className="w-full mt-1 px-3 py-2 border rounded text-sm"
                  value={r.semester}
                  onChange={(e) => updateRecord(idx, 'semester', e.target.value)}
                >
                  <option value="">Select</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                {form.academicRecords.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRecord(idx)}
                    className="mt-5 px-3 py-2 text-xs rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Fee details */}
        <div className="bg-white p-4 rounded-xl shadow grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600">Total fees</label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              value={form.feeDetails.totalFees}
              onChange={(e) => setFee('totalFees', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Paid amount</label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              value={form.feeDetails.paidAmount}
              onChange={(e) => setFee('paidAmount', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">Pending amount</label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 border rounded text-sm"
              value={form.feeDetails.pendingAmount}
              onChange={(e) => setFee('pendingAmount', e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/students')}
            className="px-4 py-2 border rounded text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save student'}
          </button>
        </div>
      </form>
    </div>
  );
}
