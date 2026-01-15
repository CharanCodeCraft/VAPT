'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

export default function ProfileDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const requestorid = searchParams.get('requestorid');
      // VULNERABLE ENDPOINT - requestorid can be manipulated
      const response = await api.get(`/profile/getdetails/${params.id}?requestorid=${requestorid}`);
      setProfileData(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  if (!profileData) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Student Profile</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div><strong>Name:</strong> {profileData.name}</div>
          <div><strong>USN:</strong> {profileData.usn}</div>
          <div><strong>Email:</strong> {profileData.email}</div>
          <div><strong>Phone:</strong> {profileData.phone}</div>
          <div><strong>Department:</strong> {profileData.department}</div>
          <div><strong>Semester:</strong> {profileData.semester}</div>
          <div><strong>DOB:</strong> {profileData.dateOfBirth}</div>
          <div><strong>Parent Contact:</strong> {profileData.parentContact}</div>
          <div><strong>Address:</strong> {profileData.address}</div>
        </div>

        {profileData.academicRecords && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Academic Records</h2>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Subject</th>
                  <th className="border p-2">Marks</th>
                  <th className="border p-2">Semester</th>
                </tr>
              </thead>
              <tbody>
                {profileData.academicRecords.map((record, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{record.subject}</td>
                    <td className="border p-2">{record.marks}</td>
                    <td className="border p-2">{record.semester}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {profileData.feeDetails && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Fee Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div><strong>Total:</strong> ₹{profileData.feeDetails.totalFees}</div>
              <div><strong>Paid:</strong> ₹{profileData.feeDetails.paidAmount}</div>
              <div><strong>Pending:</strong> ₹{profileData.feeDetails.pendingAmount}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
